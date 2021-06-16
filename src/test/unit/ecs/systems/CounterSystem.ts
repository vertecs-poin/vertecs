import CounterComponent from "../components/CounterComponent";
import { Entity, System } from "../../../../ecs";

/**
 * This system keeps track of the number of times an entity became eligible
 * It also increments all counter components
 */
export default class CounterSystem extends System<[CounterComponent]> {
  public counter: number;

  public constructor() {
    super([CounterComponent]);
    this.counter = 0;
  }

  public initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }

  protected onEligible(entity: Entity) {
    this.counter++;
  }

  public onUpdate(entities: [CounterComponent][]): void {
    entities.forEach(([counterComponent]) => {
      counterComponent.increment();
    });
  }
}
