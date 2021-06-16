import KeyboardInputHandlerSystem from "./KeyboardInputHandlerSystem";
import { CameraComponent } from "../../gltf";
import { WebGpuSystem } from "../../webgpu";
import { Transform } from "../../math";
import { Entity } from "../../ecs";

export default class CameraKeyboardInputSystem extends KeyboardInputHandlerSystem<[CameraComponent, Transform]> {
  #currentCameraIndex: number;

  public constructor() {
    super([CameraComponent, Transform], 16);
    this.#currentCameraIndex = 0;
  }

  protected onEligible(entity: Entity) {
    console.debug(entity);
  }

  public onKeyDown(event: KeyboardEvent): void {
    const cameraTransform = WebGpuSystem.cameraEntity.getComponent(Transform);
    if (event.code.startsWith("Numpad")) {
      this.#currentCameraIndex = Number.parseInt(event.key);
    } else if (cameraTransform) {
      switch (event.key) {
        case "z":
          cameraTransform.translate([0, 0, -.5]);
          break;
        case "s":
          cameraTransform.translate([0, 0, .5]);
          break;
        case "d":
          cameraTransform.translate([.5, 0, 0]);
          break;
        case "q":
          cameraTransform.translate([-.5, 0, 0]);
          break;
        case " ":
          cameraTransform.translate([0, .5, 0]);
          break;
        case "l":
          cameraTransform.translate([0, -.5, 0]);
          break;
        default:
          console.debug(event.key);
      }
    }

    const entity = this.$entities.get(this.#currentCameraIndex);
    if (entity) {
      WebGpuSystem.setCameraEntity(entity);
    }
  }

  public onKeyUp(event: KeyboardEvent): void {

  }
}
