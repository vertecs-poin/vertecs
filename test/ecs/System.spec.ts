import { assert } from "chai";
import {Component, System} from '../../src/ecs';
import {SystemManager} from '../../src/ecs';
import Entity from '../../src/ecs/Entity';
import EmptyComponent from "./components/EmptyComponent";
import EmptySystem from "./systems/EmptySystem";

class SimpleEligibleSystem extends System {

  public constructor(tps?: number) {
    super([EmptyComponent], tps);
  }

  public init(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public update(): void {
  }

}

class TickPerSecondSystem extends System {
  public counter: number;

  constructor(tps?: number) {
    super([], tps);
    this.counter = 0;
  }

  init(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public update(): void {
    this.counter++;
  }
}

describe("System", () => {

  beforeEach(async () => {
    SystemManager.clear();
  });

  describe("Add", () => {
    it("should add a system", async () => {
      const system = new EmptySystem();

      await SystemManager.addSystem(system);

      assert.equal(SystemManager.systems.length, 1);
    });

    it("should add systems of same class", async () => {
      const system = new EmptySystem();
      const sameClassSystem = new EmptySystem();

      await SystemManager.addSystem(system);
      await SystemManager.addSystem(sameClassSystem);

      assert.equal(SystemManager.systems.length, 2);
    });

    it("should not add same system", async () => {
      const system = new EmptySystem();

      await SystemManager.addSystem(system);
      await SystemManager.addSystem(system);

      assert.equal(SystemManager.systems.length, 1);
    });
  });

  describe("Eligiblity", () => {
    const system = new SimpleEligibleSystem();

    it("should be eligible", () => {
      const eligibleEntity = new Entity();
      eligibleEntity.addComponent(new EmptyComponent());

      const eligibility = system.isEligible(eligibleEntity);

      assert.isTrue(eligibility);
    });

    it("should not be eligible", () => {
      const eligibleEntity = new Entity();

      const eligibility = system.isEligible(eligibleEntity);

      assert.isFalse(eligibility);
    });

    it("should be eligible when system is added after the entity is eligible", () => {
      const eligibleEntity = new Entity();
      eligibleEntity.addComponent(new EmptyComponent());

      const eligibility = system.isEligible(eligibleEntity);

      assert.isTrue(eligibility);
    });
  });

  describe("Update", function() {
    describe("tps", () => {
      it("should update whenever called (undefined tps)", () => {
        const system = new TickPerSecondSystem(500);

        system.update();
        system.update();
        system.update();

        assert.equal(system.counter, 3);
      });

      it("should update every 500ms (2 tps)", async () => {
        const system = new TickPerSecondSystem(500);

        system.update();
        system.update();
        await setTimeout(() => {
        }, 500);
        system.update();

        assert.equal(system.counter, 2);
      });
    });

    describe("filter", () => {
      it("should only contains SimpleComponents", async () => {
        const simpleEligibleSystem = new SimpleEligibleSystem();
        const entity = new Entity();
        entity.addComponent(new class A extends Component {
        });
        entity.addComponent(new class B extends Component {
        });
        entity.addComponent(new class C extends Component {
        });
        entity.addComponent(new EmptyComponent());

        await SystemManager.addSystem(simpleEligibleSystem);

        let entities = simpleEligibleSystem.getEntities();
        assert.equal(entities.get(entity.id)?.length, 1);
        assert.instanceOf(simpleEligibleSystem.getEntities().get(entity.id), SimpleEligibleSystem);
      });
    });
  });
});
