import { System } from "../../../../ecs";

export default class TickPerSecondSystem extends System<[]> {
  public counter: number;

  public constructor(tps?: number) {
    super([], tps);
    this.counter = 0;
  }

  public initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public onUpdate(): void {
    this.counter++;
  }
}
