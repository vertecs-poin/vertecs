import { Component, Entity, System } from "../../ecs";

export default abstract class KeyboardInputHandlerSystem<T extends Component[] = []> extends System<T> {
  private buffer: KeyboardEvent[];

  protected constructor(components: Function[], tps = 16) {
    super(components, tps);
    this.buffer = [];
  }

  public async initialize(): Promise<void> {
    document.addEventListener("keydown", e => this.buffer.push(e));
    document.addEventListener("keyup", e => this.buffer.push(e));
  }

  protected onEligible(entity: Entity): void {
  }

  public onUpdate(): void {
    this.buffer.forEach(event => {
      switch (event.type) {
        case "keydown":
          return this.onKeyDown(event);
        case "keyup":
          return this.onKeyUp(event);
      }
    });

    // clear buffer
    this.buffer.length = 0;
  }

  public abstract onKeyDown(event: KeyboardEvent): void;

  public abstract onKeyUp(event: KeyboardEvent): void;
}
