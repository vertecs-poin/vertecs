import { GpuBuffer, WebGpuSystem } from "../index";
import { Accessor, Primitive, Texture } from "../../gltf";
import { Transform } from "../../math";
import GpuBufferUtils from "../utils/GpuBufferUtils";
import axios from "axios";
import PbrMetallicRoughnessUtils from "../views/PbrMetallicRoughnessUtils";
import ShaderUtils from "../utils/ShaderUtils";

export default class PrimitiveViewComponent {
  #pipeline?: GPURenderPipeline;
  readonly #primitive: Primitive;

  #indexBuffer: GPUBuffer | undefined;
  #attributeBuffers: Map<number, GPUBuffer>;

  #sampler?: GPUSampler;
  #texture?: GPUTexture;

  #transformUniformBuffer?: GPUBuffer;
  #transformBindGroup?: GPUBindGroup;

  #materialUniformBuffer?: GPUBuffer;
  #materialBindGroup?: GPUBindGroup;

  #cameraBindGroup?: GPUBindGroup;

  public constructor(primitive: Primitive) {
    this.#primitive = primitive;
    this.#attributeBuffers = new Map();
  }

  public async initialize(): Promise<void> {
    let sourceFragmentShader = (await axios.get("assets/shaders/fragment/default.glsl")).data;
    let sourceVertexShader = (await axios.get("assets/shaders/vertex/default.glsl")).data;

    const definitions = ShaderUtils.getDefinitionsFromPrimitive(this.#primitive);
    sourceFragmentShader = sourceFragmentShader.replace(
      "#DEFINITIONS_PLACEHOLDER",
      definitions.map(definition => `#define ${definition}\r\n`)
    );
    sourceVertexShader = sourceVertexShader.replace(
      "#DEFINITIONS_PLACEHOLDER",
      definitions.map(definition => `#define ${definition}\r\n`)
    );

    this.#pipeline = WebGpuSystem.device.createRenderPipeline({
      vertex: {
        buffers: this.getBuffers(),
        module: WebGpuSystem.device.createShaderModule({
          code: WebGpuSystem.glslang.compileGLSL(sourceVertexShader, "vertex", true)
        }),
        entryPoint: "main"
      },
      fragment: {
        targets: [{
          format: "bgra8unorm" as GPUTextureFormat
        }],
        module: WebGpuSystem.device.createShaderModule({
          code: WebGpuSystem.glslang.compileGLSL(sourceFragmentShader, "fragment", true)
        }),
        entryPoint: "main"
      },
      primitiveTopology: "triangle-list",
      rasterizationState: {
        cullMode: "none"
      }
    });

    if (this.#primitive.indices) {
      this.#indexBuffer = GpuBufferUtils.createFromAccessor(this.#primitive.indices, GPUBufferUsage.INDEX);
    }

    for (const [accessorName, accessor] of this.#primitive.attributes.entries()) {
      const accessorBuffer = GpuBufferUtils.createFromAccessor(accessor, GPUBufferUsage.VERTEX);
      this.#attributeBuffers.set(PrimitiveViewComponent.getShaderLocation(accessorName), accessorBuffer);
    }

    const positionAccessor = this.#primitive.attributes.get("POSITION");
    if (!positionAccessor) {
      throw new Error("Position accessor not found");
    }

    this.#transformUniformBuffer = WebGpuSystem.device.createBuffer({
      size: 64,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    this.#transformBindGroup = WebGpuSystem.device.createBindGroup({
      layout: this.#pipeline.getBindGroupLayout(0),
      entries: [{
        binding: 0,
        resource: {
          buffer: this.#transformUniformBuffer,
          offset: 0,
          size: 64
        }
      }]
    });

    this.#materialUniformBuffer = PbrMetallicRoughnessUtils.toBuffer(this.#primitive.material.pbrMetallicRoughness);
    const sampler = this.#primitive.material.pbrMetallicRoughness.baseColorTextureInfo?.texture.sampler;
    const texture = this.#primitive.material.pbrMetallicRoughness.baseColorTextureInfo?.texture.source;

    const entries: GPUBindGroupEntry[] = [{
      binding: 1,
      resource: {
        buffer: this.#materialUniformBuffer,
        offset: 0,
        size: 32
      }
    }];

    if (sampler && texture) {
      this.#sampler = WebGpuSystem.device.createSampler({
        magFilter: "linear",
        minFilter: "linear"
      });
      this.#texture = WebGpuSystem.device.createTexture({
        size: [texture.width, texture.height, 1],
        format: "rgba8unorm",
        usage: GPUTextureUsage.SAMPLED | GPUTextureUsage.COPY_DST
      });

      WebGpuSystem.device.queue.copyImageBitmapToTexture(
        { imageBitmap: texture }, { texture: this.#texture },
        [texture.width, texture.height, 1]
      );

      entries.push({
        binding: 2,
        resource: this.#sampler
      }, {
        binding: 3,
        resource: this.#texture.createView()
      });
    }

    this.#materialBindGroup = WebGpuSystem.device.createBindGroup({
      layout: this.#pipeline.getBindGroupLayout(1),
      entries
    });

    this.#cameraBindGroup = WebGpuSystem.device.createBindGroup({
      layout: this.#pipeline.getBindGroupLayout(2),
      entries: [{
        binding: 0,
        resource: {
          buffer: WebGpuSystem.cameraBuffer,
          size: 4 * 16 * 2,
          offset: 0
        }
      }]
    });
  }

  /**
   * Return a list of GPUVertexBufferLayout from a primitive
   * @private
   */
  private getBuffers(): GPUVertexBufferLayout[] {
    const buffers: GPUVertexBufferLayout[] = [];
    for (const [accessorName, accessor] of this.#primitive.attributes) {
      buffers.push({
        arrayStride: accessor.getByteLength() / accessor.count,
        attributes: [
          {
            shaderLocation: PrimitiveViewComponent.getShaderLocation(accessorName),
            offset: 0,
            format: PrimitiveViewComponent.getFormat(accessor)
          }
        ]
      });
    }
    return buffers;
  }

  /**
   * Return the shader location of an accessor
   * @param accessor
   * @private
   */
  private static getShaderLocation(accessor: string) {
    switch (accessor) {
      case "POSITION": {
        return 0;
      }
      default: {
        return 1;
      }
    }
  }

  /**
   * Return the shader location of an accessor
   * @param accessor
   * @private
   */
  private static getFormat(accessor: Accessor) {
    switch (accessor.type) {
      case "VEC3":
        return "float32x3";
      case "VEC2":
        return "float32x2";
      default: {
        throw new Error("Accessor type not supported" + accessor.type);
      }
    }
  }

  public draw(transform: Transform): void {
    if (this.#pipeline && this.#primitive && this.#transformBindGroup && this.#transformUniformBuffer) {
      // Update transform uniform buffer
      const modelToWorldMatrix = transform.getModelToWorldMatrix() as Float32Array;
      WebGpuSystem.device.queue.writeBuffer(
        this.#transformUniformBuffer,
        0,
        modelToWorldMatrix.buffer,
        modelToWorldMatrix.byteOffset,
        modelToWorldMatrix.byteLength
      );

      WebGpuSystem.renderPassEncoder.setPipeline(this.#pipeline);

      this.#attributeBuffers.forEach((buffer, index) => {
        WebGpuSystem.renderPassEncoder.setVertexBuffer(index, buffer);
      });

      WebGpuSystem.renderPassEncoder.setBindGroup(0, this.#transformBindGroup);

      if (this.#materialUniformBuffer && this.#materialBindGroup) {
        WebGpuSystem.renderPassEncoder.setBindGroup(1, this.#materialBindGroup);
      }

      if (this.#cameraBindGroup) {
        WebGpuSystem.renderPassEncoder.setBindGroup(2, this.#cameraBindGroup);
      }

      if (this.#indexBuffer) {
        WebGpuSystem.renderPassEncoder.setIndexBuffer(this.#indexBuffer, "uint16");
        WebGpuSystem.renderPassEncoder.drawIndexed(this.#primitive.getIndexCount(), 1, 0, 0);
      } else {
        WebGpuSystem.renderPassEncoder.drawIndexed(this.#primitive.getIndexCount(), 1, 0, 0);
      }
    }
  }
}
