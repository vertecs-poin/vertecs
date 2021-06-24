import { CameraComponent } from "../../../gltf";
import System from "../../../ecs/System";
import Entity from "../../../ecs/Entity";
import WebGpuSystem from "./WebGpuSystem";
import { Transform } from "../../../math";

export default class CameraSystem extends System<[CameraComponent, Transform]> {

  public constructor(tps = 8) {
    super([CameraComponent, Transform], tps);
  }

  public async initialize(): Promise<void> {
  }

  protected onEligible(entity: Entity): void {
    const cameraComponent = entity.getComponent(CameraComponent);
    const transform = entity.getComponent(Transform);
    if (cameraComponent && transform) {
      WebGpuSystem.setCameraEntity(entity);
    }
  }

  public onUpdate(entities: [CameraComponent, Transform][], timePassed: number): void {
  }
}
