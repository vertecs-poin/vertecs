import glslang, { Glslang } from "@webgpu/glslang/dist/web-devel-onefile/glslang";
import System from "../../ecs/System";
import MeshViewComponent from "../components/MeshViewComponent";
import Entity from "../../ecs/Entity";
import GpuBufferUtils from "../utils/GpuBufferUtils";
import { Transform } from "../../math";
import { CameraComponent, Mesh } from "../../gltf";

export default class WebGpuSystem extends System<[Transform, Mesh]> {
  public static canvas: HTMLCanvasElement;
  public static device: GPUDevice;
  public static context: GPUCanvasContext;
  public static glslang: Glslang;
  public static swapChain: GPUSwapChain;

  public static renderPassDescriptor: GPURenderPassDescriptor;
  public static textureView: GPUTextureView;
  public static depthView: GPUTextureView;
  public static commandEncoder: GPUCommandEncoder;
  public static renderPassEncoder: GPURenderPassEncoder;

  public meshViews: [MeshViewComponent, Transform][];

  public static cameraEntity: Entity;

  public static cameraBuffer: GPUBuffer;

  public constructor(tps?: number) {
    super([Mesh, Transform], tps);
    this.meshViews = [];
  }

  public initializeCamera(): void {
    const cameraComponent = new CameraComponent("orthographic");
    WebGpuSystem.cameraEntity = new Entity();

    const transform = new Transform(undefined, [0, 0, 1]);
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
  }

  public static setCameraEntity(entity: Entity) {
    WebGpuSystem.cameraEntity = entity;
  }

  public static updateCamera() {
    const transform = WebGpuSystem.cameraEntity.getComponent(Transform);
    const cameraComponent = WebGpuSystem.cameraEntity.getComponent(CameraComponent);

    if (transform && cameraComponent) {
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
    }
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
    const transform = entity.getComponent(Transform);

    if (!mesh || !transform) {
      throw new Error("Entity eligible with no mesh or transform");
    }

    this.meshViews.push([new MeshViewComponent(entity), transform]);
  }

  /**
   * Draw all active primitive views
   */
  public onUpdate(entities: [Transform, Mesh][], timePassed: number, ): void {
    WebGpuSystem.commandEncoder = WebGpuSystem.device.createCommandEncoder();
    WebGpuSystem.textureView = WebGpuSystem.swapChain.getCurrentTexture().createView();
    WebGpuSystem.depthView = WebGpuSystem.device.createTexture({
      label: "depthTexture",
      size: { width: 640, height: 640, depthOrArrayLayers: 1 },
      format: "depth24plus-stencil8",
      usage: GPUTextureUsage.RENDER_ATTACHMENT
    }).createView();

    WebGpuSystem.renderPassDescriptor = {
      colorAttachments: [
        {
          storeOp: "store",
          view: WebGpuSystem.textureView,
          loadValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 }
        }
      ],
      depthStencilAttachment: {
        view: WebGpuSystem.depthView,

        depthLoadValue: 1.0,
        depthStoreOp: "store",

        stencilLoadValue: 0,
        stencilStoreOp: "store",
      }
    };
    WebGpuSystem.updateCamera();

    WebGpuSystem.renderPassEncoder = WebGpuSystem.commandEncoder.beginRenderPass(WebGpuSystem.renderPassDescriptor);
    this.meshViews.forEach(([meshViewComponent, transform]) => {
      meshViewComponent.draw(transform);
    });
    WebGpuSystem.renderPassEncoder.endPass();

    WebGpuSystem.device.queue.submit([WebGpuSystem.commandEncoder.finish()]);
  }
}
