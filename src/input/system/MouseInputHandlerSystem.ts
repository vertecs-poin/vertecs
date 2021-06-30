import { Entity, System } from "../../ecs";
import MouseInputComponent from "../components/MouseInputComponent";
import ArcBallCameraComponent from "../components/ArcBallCameraComponent";

export default class MouseInputHandlerSystem extends System<[MouseInputComponent]> {
  private buffer: MouseEvent[];

  public constructor(tps?: number) {
    super([ArcBallCameraComponent], tps);
    this.buffer = [];
  }

  public async initialize(): Promise<void> {
    document.addEventListener("mousemove", e => this.buffer.push(e));
  }

  protected onEligible(entity: Entity): void {
    console.debug("Eligible");
  }

  public onUpdate(entities: [MouseInputComponent][]): void {
    this.buffer.forEach(event => {
      switch (event.type) {
        case "mousemove":
          entities.forEach(([mouseInputComponent]) => mouseInputComponent.onMouseMove(event));
          break;
      }
    });

    // clear buffer
    this.buffer.length = 0;
  }
}
