import { assert } from "chai";
import EmptyComponent from "./components/EmptyComponent";
import SimpleCounterComponent from "./components/CounterComponent";
import CounterUpdateSystem from "./systems/CounterUpdateSystem";
import { System, Entity, SystemManager } from "../../src/ecs";

class UpdateEntityOnEligibleSystem extends System {
  public counter: number;

  constructor() {
    super([EmptyComponent, SimpleCounterComponent]);
    this.counter = 0;
  }

  init(): Promise<void> {
    return Promise.resolve(undefined);
  }

  protected onEligible(entity: Entity): void {
    entity.getComponent(SimpleCounterComponent).counter++;
  }

  public update(): void {
  }
}

describe("SystemManager", () => {
  let updateEntityOnEligibleSystem: UpdateEntityOnEligibleSystem;
  let eligibleEntity: Entity;
  let notEligibleEntity: Entity;

  beforeEach(() => {
    updateEntityOnEligibleSystem = new UpdateEntityOnEligibleSystem();
    eligibleEntity = new Entity();
    notEligibleEntity = new Entity();
    SystemManager.clear();
  });

  describe("Update", () => {
    it("should update the systems once", async () => {
      const counterOnUpdateSystem = new CounterUpdateSystem();
      await SystemManager.addSystem(counterOnUpdateSystem);

      SystemManager.update();

      assert.equal(counterOnUpdateSystem.counter, 1);
    });

    it("should update only eligible entities", async () => {
      updateEntityOnEligibleSystem = new UpdateEntityOnEligibleSystem();
      await SystemManager.addSystem(updateEntityOnEligibleSystem);
      eligibleEntity.addComponent(new SimpleCounterComponent());
      eligibleEntity.addComponent(new EmptyComponent());
      notEligibleEntity.addComponent(new SimpleCounterComponent());

      SystemManager.update();

      assert.equal(eligibleEntity.getComponent(SimpleCounterComponent).counter, 1);
      assert.equal(notEligibleEntity.getComponent(SimpleCounterComponent).counter, 0);
    });
  });
});
