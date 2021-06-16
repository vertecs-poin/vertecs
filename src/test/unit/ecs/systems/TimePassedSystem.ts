import { System } from "../../../../ecs";

export default class TimePassedSystem extends System<[]> {
  public timePassed: number;

  public constructor() {
    super([]);
    this.timePassed = 0;
  }

  public initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public onUpdate(entities: [][], timePassed: number): void {
    this.timePassed = timePassed;
  }
}
