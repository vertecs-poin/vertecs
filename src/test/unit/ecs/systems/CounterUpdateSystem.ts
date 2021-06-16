import { System } from "../../../../ecs";

/**
 * System that tracks the number of times it has been updated
 */
export default class CounterUpdateSystem extends System<[]> {
  public counter: number;

  public constructor() {
    super([]);
    this.counter = 0;
  }

  public initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public onUpdate(): void {
    this.counter++;
  }
}
