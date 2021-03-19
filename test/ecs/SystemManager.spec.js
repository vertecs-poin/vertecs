import { assert } from "chai";
import EmptyComponent from "./components/EmptyComponent";
import SimpleCounterComponent from "./components/CounterComponent";
import CounterUpdateSystem from "./systems/CounterUpdateSystem";
class UpdateEntityOnEligibleSystem extends System {
    constructor() {
        super([EmptyComponent, SimpleCounterComponent]);
        this.counter = 0;
    }
    init() {
        return Promise.resolve(undefined);
    }
    onEligible(entity) {
        entity.getComponent(SimpleCounterComponent).counter++;
    }
    update() {
    }
}
describe("SystemManager", () => {
    let updateEntityOnEligibleSystem;
    let eligibleEntity;
    let notEligibleEntity;
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
//# sourceMappingURL=SystemManager.spec.js.map