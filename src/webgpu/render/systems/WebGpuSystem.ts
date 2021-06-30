import glslang, { Glslang } from "@webgpu/glslang/dist/web-devel-onefile/glslang";
import System from "../../../ecs/System";
import MeshViewComponent from "../components/MeshViewComponent";
import Entity from "../../../ecs/Entity";
import GpuBufferUtils from "../../utils/GpuBufferUtils";
import { Transform } from "../../../math";
import { CameraComponent, Mesh } from "../../../gltf";
import { LightSystem } from "../../lighting";

export default class WebGpuSystem extends System<[Transform, Mesh]> {
  public static canvas: HTMLCanvasElement;
  public static device: GPUDevice;
  public static context: GPUPresentationContext;
  public static glslang: Glslang;

  public static renderPassDescriptor: GPURenderPassDescriptor;
  public static textureView: GPUTextureView;
  public static depthView: GPUTextureView;
  public static commandEncoder: GPUCommandEncoder;
  public static renderPassEncoder: GPURenderPassEncoder;

  public meshViews: [MeshViewComponent, Transform][];

  public static cameraEntity: Entity;
  public static cameraBuffer: GPUBuffer;

  public static lightSceneBuffer: GPUBuffer;

  public constructor(tps?: number) {
    super([Mesh, Transform], tps);
    this.meshViews = [];
  }

  public initializeLightScene(): void {
    WebGpuSystem.lightSceneBuffer = WebGpuSystem.device.createBuffer({
      size: LightSystem.MAX_BYTE_SIZE,
      mappedAtCreation: false,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
  }

  public initializeCamera(): void {
    const cameraComponent = new CameraComponent("perspective");
    WebGpuSystem.cameraEntity = new Entity();
    const transform = new Transform(undefined, [0, 2, 10]);
    WebGpuSystem.cameraEntity.addComponent(transform);
    WebGpuSystem.cameraEntity.addComponent(cameraComponent);

    WebGpuSystem.cameraBuffer = WebGpuSystem.device.createBuffer({
      size: 16 * 4 * 2,
      mappedAtCreation: false,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    GpuBufferUtils.updateBufferFromMat4(
      cameraComponent.getViewMatrix(transform),
      WebGpuSystem.cameraBuffer,
      0
    );

    GpuBufferUtils.updateBufferFromMat4(
      cameraComponent.projection,
      WebGpuSystem.cameraBuffer,
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
      GpuBufferUtils.updateBufferFromMat4(cameraComponent.getViewMatrix(transform), WebGpuSystem.cameraBuffer, 0);
      GpuBufferUtils.updateBufferFromMat4(cameraComponent.projection, WebGpuSystem.cameraBuffer, 64);
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

    device.lost.then((info) => {
      console.error("Device was lost.", info);
    });

    device.addEventListener("uncapturederror", (event: unknown) => {
      console.debug(event);
    });

    WebGpuSystem.glslang = await glslang();
    WebGpuSystem.device = device;
    WebGpuSystem.canvas = canvas;
    WebGpuSystem.context = context;

    // TODO: Update @webgpu/types
    WebGpuSystem.context.configure({
      device: WebGpuSystem.device,
      format: "bgra8unorm" as GPUTextureFormat
    });

    this.initializeCamera();
    // this.initializeLightScene();
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
  public onUpdate(entities: [Transform, Mesh][], timePassed: number): void {
    // TODO: Update @webgpu/types
    // @ts-ignore
    WebGpuSystem.textureView = WebGpuSystem.context.getCurrentTexture().createView();
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
        stencilStoreOp: "store"
      }
    };
    WebGpuSystem.commandEncoder = WebGpuSystem.device.createCommandEncoder();
    WebGpuSystem.updateCamera();

    WebGpuSystem.renderPassEncoder = WebGpuSystem.commandEncoder.beginRenderPass(WebGpuSystem.renderPassDescriptor);

    this.meshViews.forEach(([meshViewComponent, transform]) => {
      meshViewComponent.draw(transform);
    });
    WebGpuSystem.renderPassEncoder.endPass();

    WebGpuSystem.device.queue.submit([WebGpuSystem.commandEncoder.finish()]);
  }
}
