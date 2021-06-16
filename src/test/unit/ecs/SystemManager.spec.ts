import { assert } from "chai";
import EmptyComponent from "./components/EmptyComponent";
import SimpleCounterComponent from "./components/CounterComponent";
import CounterUpdateSystem from "./systems/CounterUpdateSystem";
import { Ecs, Entity, System } from "../../../ecs";

class UpdateEntityOnEligibleSystem extends System<[EmptyComponent, SimpleCounterComponent]> {
  public counter: number;

  constructor() {
    super([EmptyComponent, SimpleCounterComponent]);
    this.counter = 0;
  }

  initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }

  protected onEligible(entity: Entity): void {
    const component = entity.getComponent(SimpleCounterComponent);
    if (component) {
      component.counter += 1;
    }
  }

  public onUpdate(): void {
  }
}

describe("SystemManager", () => {
  let updateEntityOnEligibleSystem: UpdateEntityOnEligibleSystem;
  let eligibleEntity: Entity;
  let notEligibleEntity: Entity;

  beforeEach(() => {
    Ecs.stop();
    updateEntityOnEligibleSystem = new UpdateEntityOnEligibleSystem();
    eligibleEntity = new Entity();
    notEligibleEntity = new Entity();
  });

  describe("Update", () => {
    it("should update the systems once", async () => {
      const counterOnUpdateSystem = new CounterUpdateSystem();
      await Ecs.addSystem(counterOnUpdateSystem);

      Ecs.update();

      assert.equal(counterOnUpdateSystem.counter, 1);
    });

    it("should update only eligible entities", async () => {
      updateEntityOnEligibleSystem = new UpdateEntityOnEligibleSystem();
      await Ecs.addSystem(updateEntityOnEligibleSystem);
      eligibleEntity.addComponent(new SimpleCounterComponent());
      eligibleEntity.addComponent(new EmptyComponent());
      notEligibleEntity.addComponent(new SimpleCounterComponent());

      Ecs.update();

      const simpleCounterComponent = eligibleEntity.getComponent(SimpleCounterComponent);
      const simpleCounterComponent2 = notEligibleEntity.getComponent(SimpleCounterComponent);

      assert.equal(simpleCounterComponent!.counter, 1);
      assert.equal(simpleCounterComponent2!.counter, 0);
    });
  });
});
