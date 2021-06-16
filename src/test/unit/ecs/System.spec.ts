import { assert } from "chai";
import EmptyComponent from "./components/EmptyComponent";
import CounterSystem from "./systems/CounterSystem";
import EmptySystem from "./systems/EmptySystem";
import TickPerSecondSystem from "./systems/TickPerSecondSystem";
import CounterComponent from "./components/CounterComponent";
import TimePassedSystem from "./systems/TimePassedSystem";
import { Component, Ecs, Entity } from "../../../ecs";

describe("System", () => {

  beforeEach(async () => {
    Ecs.stop();
  });

  describe("Add", () => {
    it("should add a system", async () => {
      const system = new EmptySystem();

      await Ecs.addSystem(system);

      assert.equal(Ecs.systems.length, 1);
    });

    it("should add systems of same class", async () => {
      const system = new EmptySystem();
      const sameClassSystem = new EmptySystem();

      await Ecs.addSystem(system);
      await Ecs.addSystem(sameClassSystem);

      assert.equal(Ecs.systems.length, 2);
    });

    it("should not add same system", async () => {
      const system = new EmptySystem();

      await Ecs.addSystem(system);
      await Ecs.addSystem(system);

      assert.equal(Ecs.systems.length, 1);
    });
  });

  describe("Eligiblity", () => {
    const system = new EmptySystem();

    it("should be eligible", () => {
      const eligibleEntity = new Entity();
      eligibleEntity.addComponent(new EmptyComponent());

      const eligibility = system.isEligible(eligibleEntity.getComponents());

      assert.isTrue(eligibility);
    });

    it("should only be eligible once", async () => {
      const counterEntity = new Entity();
      counterEntity.addComponent(new CounterComponent());
      const counterSystem = new CounterSystem();

      await Ecs.addSystem(counterSystem);
      counterEntity.addComponent(new EmptyComponent());

      assert.equal(counterSystem.counter, 1);
    });

    it("should not be eligible", () => {
      const eligibleEntity = new Entity();
      eligibleEntity.addComponent(new CounterComponent());

      const eligibility = system.isEligible(eligibleEntity.getComponents());

      assert.isFalse(eligibility);
    });

    it("should be eligible when system is added after the entity is eligible", async () => {
      const counterEntity = new Entity();
      counterEntity.addComponent(new CounterComponent());
      const counterSystem = new CounterSystem();

      await Ecs.addSystem(counterSystem);

      assert.equal(counterSystem.counter, 1);
    });

    it("should both be eligible", async () => {
      const firstEligibleEntity = new Entity();
      const secondEligibleEntity = new Entity();
      const counterComponent = new CounterComponent();
      firstEligibleEntity.addComponent(counterComponent);
      secondEligibleEntity.addComponent(counterComponent);
      const counterSystem = new CounterSystem();

      await Ecs.addSystem(counterSystem);

      assert.equal(counterSystem.counter, 2);
      assert.equal(counterSystem.entities.size, 2);
    });
  });

  describe("Update", function() {
    describe("tps", () => {
      it("should update whenever called (undefined tps)", () => {
        const system = new TickPerSecondSystem();

        system.update();
        system.update();
        system.update();

        assert.equal(system.counter, 3);
      });

      it("should update every 500ms (2 tps)", async () => {
        const system = new TickPerSecondSystem(2);

        system.update();
        system.update();
        await new Promise(f => setTimeout(f, 501));
        system.update();

        assert.equal(system.counter, 2);
      });
    });

    describe("filter", () => {
      it("should only contains EmptyComponents", async () => {
        const eligibleSystem = new EmptySystem();
        await Ecs.addSystem(eligibleSystem);

        const entity = new Entity();
        entity.addComponent(new class A extends Component {
        });
        entity.addComponent(new class B extends Component {
        });
        entity.addComponent(new class C extends Component {
        });
        entity.addComponent(new EmptyComponent());

        assert.equal(eligibleSystem.entities.get(entity.id)?.components?.length, 1);
        // TODO: uncomment this
        // assert.instanceOf(components![0], EmptyComponent);
      });
    });

    describe("timePassed", () => {
      it("should be higher than 500ms (and less than 1500)", async () => {
        const timePassedSystem = new TimePassedSystem();

        await Ecs.addSystem(timePassedSystem);
        Ecs.update();
        await new Promise(f => setTimeout(f, 500));
        Ecs.update();

        const timePassed = timePassedSystem.timePassed;
        assert.isTrue(timePassed >= 500 && timePassed <= 1500, `time passed ${timePassed} not between than 500 and 1500ms`);
      });
    });
  });
});
