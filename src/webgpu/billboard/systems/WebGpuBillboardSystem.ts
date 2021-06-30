import { System } from "../../../ecs";
import { Transform } from "../../../math";
import { vec3 } from "gl-matrix";
import WebGpuBillboardComponent from "../components/WebGpuBillboardComponent";
import WebGpuSystem from "../../render/systems/WebGpuSystem";

export default class WebGpuBillboardSystem extends System<[WebGpuBillboardComponent, Transform]> {

  public constructor(tps?: number) {
    super([WebGpuBillboardComponent, Transform], tps);
  }

  public async initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public onUpdate(entities: [WebGpuBillboardComponent, Transform][], timePassed: number): void {
    entities.forEach(([billboardComponent, transform]) => {
      const cameraTransform = WebGpuSystem.cameraEntity.getComponent(Transform);
      if (cameraTransform) {
        const cameraWorldPosition = cameraTransform?.getWorldTranslation(vec3.create());

        // For whatever reason, the x and y positions needs to be flipped
        transform.setLookAtXyz(-cameraWorldPosition[0], -cameraWorldPosition[1], cameraWorldPosition[2]);
      }
    });
  }
}
