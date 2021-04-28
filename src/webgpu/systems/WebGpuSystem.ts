import glslang, { Glslang } from "@webgpu/glslang/dist/web-devel-onefile/glslang";
import System from "../../ecs/System";
import { Transform } from "../../math";
import { Entity } from "../../ecs";
import { CameraComponent, Mesh } from "../../gltf";
import MeshViewComponent from "../components/MeshViewComponent";
import GpuBufferUtils from "../utils/GpuBufferUtils";

export default class WebGpuSystem extends System<[Transform, Mesh, MeshViewComponent]> {
  public static canvas: HTMLCanvasElement;
  public static device: GPUDevice;
  public static context: GPUCanvasContext;
  public static glslang: Glslang;
  public static swapChain: GPUSwapChain;

  public static renderPassDescriptor: GPURenderPassDescriptor;
  public static textureView: GPUTextureView;
  public static commandEncoder: GPUCommandEncoder;
  public static renderPassEncoder: GPURenderPassEncoder;

  public meshViews: Map<Transform, MeshViewComponent>;

  public static cameraEntity: Entity;

  public static cameraBuffer: GPUBuffer;

  public constructor(tps?: number) {
    super([Transform, Mesh], tps);
    this.meshViews = new Map();
  }

  public initializeCamera(): void {
    WebGpuSystem.cameraEntity = new Entity();
    const cameraComponent = new CameraComponent("orthographic");
    WebGpuSystem.cameraEntity.addComponent(cameraComponent);
    const transform = new Transform(undefined, [0, 0, -1]);
    WebGpuSystem.cameraEntity.addComponent(transform);

    WebGpuSystem.cameraBuffer = WebGpuSystem.device.createBuffer({
      size: 16 * 4 * 2,
      mappedAtCreation: false,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    GpuBufferUtils.updateBufferFromMat4(
      cameraComponent.getViewMatrix(transform),
      WebGpuSystem.cameraBuffer,
      0,
      64
    );

    GpuBufferUtils.updateBufferFromMat4(
      cameraComponent.projection,
      WebGpuSystem.cameraBuffer,
      64,
      64
    );

    console.log(cameraComponent.getViewMatrix(transform))
    console.log(cameraComponent.projection)
  }

  public async initialize(): Promise<void> {
    const adapter = await navigator?.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("gpupresent");

    if (!adapter || !device || !canvas || !context) {
      throw new Error("WebGPU not supported");
    }

    WebGpuSystem.glslang = await glslang();
    WebGpuSystem.device = device;
    WebGpuSystem.canvas = canvas;
    WebGpuSystem.context = context;

    WebGpuSystem.swapChain = WebGpuSystem.context.configureSwapChain({
      device: WebGpuSystem.device,
      format: "bgra8unorm" as GPUTextureFormat
    });

    this.initializeCamera();
  }

  // Add primitive view
  protected onEligible(entity: Entity) {
    const mesh = entity.getComponent(Mesh);
    this.meshViews.set(entity.getComponent(Transform), new MeshViewComponent(mesh));
  }

  /**
   * Draw all active primitive views
   */
  public onUpdate(): void {
    WebGpuSystem.commandEncoder = WebGpuSystem.device.createCommandEncoder();
    WebGpuSystem.textureView = WebGpuSystem.swapChain.getCurrentTexture().createView();

    WebGpuSystem.renderPassDescriptor = {
      colorAttachments: [
        {
          storeOp: "store",
          view: WebGpuSystem.textureView,
          loadValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 }
        }
      ]
    };

    WebGpuSystem.renderPassEncoder = WebGpuSystem.commandEncoder.beginRenderPass(WebGpuSystem.renderPassDescriptor);
    this.$entities.forEach(([transform, mesh]) => {
      this.meshViews.get(transform)!.draw(transform);
    });
    WebGpuSystem.renderPassEncoder.endPass();

    WebGpuSystem.device.queue.submit([WebGpuSystem.commandEncoder.finish()]);
  }
}
