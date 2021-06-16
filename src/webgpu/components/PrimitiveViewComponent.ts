import { WebGpuSystem } from "../index";
import { Primitive } from "../../gltf";
import { Transform } from "../../math";
import GpuBufferUtils from "../utils/GpuBufferUtils";
import axios from "axios";
import PbrMetallicRoughnessUtils from "../views/PbrMetallicRoughnessUtils";
import ShaderUtils from "../utils/ShaderUtils";
import { Skin } from "../../skinning";

export default class PrimitiveViewComponent {
  #pipeline?: GPURenderPipeline;
  readonly #primitive: Primitive;
  readonly #skin?: Skin;

  #indexBuffer: GPUBuffer | undefined;
  #attributeBuffers: GPUBuffer[];

  #sampler?: GPUSampler;
  #texture?: GPUTexture;

  #transformUniformBuffer?: GPUBuffer;
  #transformBindGroup?: GPUBindGroup;

  #materialUniformBuffer?: GPUBuffer;
  #materialBindGroup?: GPUBindGroup;

  #skinUniformBuffer?: GPUBuffer;
  #skinBindGroup?: GPUBindGroup;

  #cameraBindGroup?: GPUBindGroup;

  public constructor(primitive: Primitive, skin?: Skin) {
    this.#primitive = primitive;
    this.#attributeBuffers = [];
    this.#skin = skin;

    console.warn(`Index buffer component size not supported : ${this.#primitive.indices?.getComponentTypeByteSize()}, defaulting to 2 bytes`);
  }

  public async initialize(): Promise<void> {
    let sourceFragmentShader = (await axios.get("assets/shaders/fragment/default.glsl")).data;
    let sourceVertexShader = (await axios.get("assets/shaders/vertex/default.glsl")).data;

    const definitions = ShaderUtils.getDefinitionsFromPrimitive(this.#primitive);
    sourceFragmentShader = sourceFragmentShader.replace(
      "#DEFINITIONS_PLACEHOLDER",
      definitions.map(definition => `#define ${definition}`).join("\r\n")
    );
    sourceVertexShader = sourceVertexShader.replace(
      "#DEFINITIONS_PLACEHOLDER",
      definitions.map(definition => `#define ${definition}`).join("\r\n")
    );

    const material = this.#primitive.material;
    this.#materialUniformBuffer = PbrMetallicRoughnessUtils.toBuffer(material.pbrMetallicRoughness);
    const baseColorTextureSampler = material.pbrMetallicRoughness.baseColorTextureInfo?.texture?.sampler;
    const texture = material.pbrMetallicRoughness.baseColorTextureInfo?.texture?.source;

    const buffers = this.getBufferVertexLayouts();

    this.#pipeline = WebGpuSystem.device.createRenderPipeline({
      vertex: {
        buffers,
        module: WebGpuSystem.device.createShaderModule({
          code: WebGpuSystem.glslang.compileGLSL(sourceVertexShader, "vertex", true)
        }),
        entryPoint: "main"
      },
      fragment: {
        targets: [{
          format: "bgra8unorm"
        }],
        module: WebGpuSystem.device.createShaderModule({
          code: WebGpuSystem.glslang.compileGLSL(sourceFragmentShader, "fragment", true)
        }),
        entryPoint: "main"
      },
      depthStencil: {
        format: "depth24plus-stencil8",
        depthCompare: "less",
        depthWriteEnabled: true
      },
      primitive: {
        topology: "triangle-list",
        cullMode: material.doubleSided ? "none" : "back"
      }
    });

    if (this.#primitive.indices) {
      this.#indexBuffer = await GpuBufferUtils.createFromAccessor("INDICES", this.#primitive.indices, GPUBufferUsage.INDEX);
    }

    for (const [accessorName, accessor] of this.#primitive.attributes) {
      const accessorBuffer = GpuBufferUtils.createFromAccessor(accessorName, accessor, GPUBufferUsage.VERTEX);
      this.#attributeBuffers.push(await accessorBuffer);
    }

    // The position accessor is required, throw an error if not found
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
          label: "transformBindGroup",
          buffer: this.#transformUniformBuffer,
          offset: 0,
          size: 64
        }
      }]
    });

    const entries: GPUBindGroupEntry[] = [{
      binding: 1,
      resource: {
        label: "materialBindGroup",
        buffer: this.#materialUniformBuffer,
        offset: 0,
        size: 32
      }
    }];

    if (baseColorTextureSampler && texture) {
      const descriptor: GPUSamplerDescriptor = {
        minFilter: PrimitiveViewComponent.getFilter(baseColorTextureSampler.minFilter),
        magFilter: PrimitiveViewComponent.getFilter(baseColorTextureSampler.magFilter),
        addressModeU: PrimitiveViewComponent.getWrap(baseColorTextureSampler.wrapS),
        addressModeV: PrimitiveViewComponent.getWrap(baseColorTextureSampler.wrapT),
        addressModeW: PrimitiveViewComponent.getWrap(baseColorTextureSampler.wrapS),
        mipmapFilter: PrimitiveViewComponent.getMipmap(baseColorTextureSampler.minFilter),
        label: baseColorTextureSampler.name
      };
      this.#sampler = WebGpuSystem.device.createSampler(descriptor);
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
          label: "cameraBindGroup",
          buffer: WebGpuSystem.cameraBuffer,
          size: 4 * 16 * 2,
          offset: 0
        }
      }]
    });

    // Rigging
    if (this.#skin) {
      this.#skinUniformBuffer = WebGpuSystem.device.createBuffer({
        size: 4 * 16 * 128,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      });
      this.#skinBindGroup = WebGpuSystem.device.createBindGroup({
        layout: this.#pipeline.getBindGroupLayout(3),
        entries: [{
          binding: 0,
          resource: {
            buffer: this.#skinUniformBuffer,
            size: 4 * 16 * 128,
            offset: 0
          }
        }]
      });
    }
  }

  /**
   * Return a list of GPUVertexBufferLayout from a primitive
   * @private
   */
  private getBufferVertexLayouts(): GPUVertexBufferLayout[] {
    const buffers: GPUVertexBufferLayout[] = [];

    for (const [accessorName, accessor] of this.#primitive.attributes) {
      buffers.push({
        // align to 4 bytes
        arrayStride: accessor.getComponentByteSize(),
        stepMode: "vertex",
        attributes: [{
          shaderLocation: PrimitiveViewComponent.getShaderLocation(accessorName),
          offset: 0,
          format: PrimitiveViewComponent.getFormat(accessorName)
        }]
      });
    }
    return buffers;
  }

  /**
   * Return the shader location of an accessor
   * @param accessorName The name of the accessor
   * @private
   */
  private static getShaderLocation(accessorName: string) {
    switch (accessorName) {
      case "POSITION":
        return 0;
      case "NORMAL":
        return 1;
      case "TEXCOORD_0":
        return 2;
      case "JOINTS_0":
        return 3;
      case "WEIGHTS_0":
        return 4;
      case "COLOR_0":
        return 5;
      case "TANGENT":
        return 6;
      default: {
        throw new Error("Accessor's shader location not found: " + accessorName);
      }
    }
  }

  // TODO: get format from accessor's metadata (5126 vec3 should be float32x3)
  /**
   * Return the shader location of an accessor
   * @private
   * @param accessorName
   */
  private static getFormat(accessorName: string): GPUVertexFormat {
    switch (accessorName) {
      case "POSITION":
        return "float32x3";
      case "NORMAL":
        return "float32x3";
      case "TEXCOORD_0":
        return "float32x2";
      case "JOINTS_0":
        return "uint16x4";
      case "WEIGHTS_0":
        return "float32x4";
      case "COLOR_0":
        return "float32x3";
      case "TANGENT":
        return "float32x4";
      default: {
        throw new Error("Accessor's shader location not found: " + accessorName);
      }
    }
  }

  private static getFilter(filter: number): "linear" | "nearest" {
    switch (filter) {
      case 9728:
        return "nearest";
      case 9729:
        return "linear";
      case 9984:
        return "nearest";
      case 9985:
        return "linear";
      case 9986:
        return "nearest";
      case 9987:
        return "linear";
      default:
        return "linear";
    }
  }

  private static getMipmap(wrap: number): "linear" | "nearest" {
    switch (wrap) {
      case 9984:
        return "nearest";
      case 9985:
        return "nearest";
      case 9986:
        return "linear";
      case 9987:
        return "linear";
      default:
        return "nearest";
    }
  }

  private static getWrap(wrap: number): "repeat" | "clamp-to-edge" | "mirror-repeat" {
    switch (wrap) {
      case 10497:
        return "repeat";
      case 33071:
        return "clamp-to-edge";
      case 33648:
        return "mirror-repeat";
      default:
        return "repeat";
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

      // Update skins
      const skinUniformBuffer = this.#skinUniformBuffer;
      if (this.#skin && skinUniformBuffer) {
        this.#skin.matrices.forEach((matrix, i) => {
          WebGpuSystem.device.queue.writeBuffer(
            skinUniformBuffer,
            i * 64,
            matrix as Float32Array
          );
        });
      }

      WebGpuSystem.renderPassEncoder.setPipeline(this.#pipeline);

      let i = 0;
      this.#attributeBuffers.forEach((buffer) => {
        WebGpuSystem.renderPassEncoder.setVertexBuffer(i++, buffer);
      });

      WebGpuSystem.renderPassEncoder.setBindGroup(0, this.#transformBindGroup);

      if (this.#materialUniformBuffer && this.#materialBindGroup) {
        WebGpuSystem.renderPassEncoder.setBindGroup(1, this.#materialBindGroup);
      }

      if (this.#cameraBindGroup) {
        WebGpuSystem.renderPassEncoder.setBindGroup(2, this.#cameraBindGroup);
      }

      if (this.#skinBindGroup) {
        WebGpuSystem.renderPassEncoder.setBindGroup(3, this.#skinBindGroup);
      }

      if (this.#indexBuffer) {
        const indexFormat = this.#primitive.indices?.getComponentTypeByteSize() === 4 ? "uint32" : "uint16";
        WebGpuSystem.renderPassEncoder.setIndexBuffer(this.#indexBuffer, indexFormat);
        WebGpuSystem.renderPassEncoder.drawIndexed(this.#primitive.getIndexCount(), 1, 0, 0);
      } else {
        WebGpuSystem.renderPassEncoder.draw(this.#primitive.getIndexCount(), 1, 0, 0);
      }
    }
  }
}
