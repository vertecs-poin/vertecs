import MouseInputComponent from "./MouseInputComponent";
import { CameraComponent } from "../../gltf";
import { WebGpuSystem } from "../../webgpu";
import { Transform } from "../../math";
import { vec3 } from "gl-matrix";
import doc = Mocha.reporters.doc;

export default class ArcBallCameraComponent extends MouseInputComponent {
  #xAngle: number;
  #yAngle: number;

  public constructor() {
    super();

    this.#xAngle = 0;
    this.#yAngle = 0;
  }

  public onMouseMove(event: MouseEvent): void {
    const camera = WebGpuSystem.cameraEntity.getComponent(CameraComponent);
    const transform = WebGpuSystem.cameraEntity.getComponent(Transform);

    if (!camera || !transform) {
      throw new Error("CameraEntity has no camera or transform");
    }

    this.#xAngle += Math.PI - 2 * Math.PI * (event.movementY / 1080);
    this.#yAngle += Math.PI - 2 * Math.PI * (event.movementX / 1920);

    // FIXME: Check if xAngle aligns with the up vector

    transform.resetRotation();
    transform.rotateX(this.#xAngle);
    transform.rotateX(this.#yAngle);
  }
}
