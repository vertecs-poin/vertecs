var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { assert } from 'chai';
import SimpleComponent from './components/SimpleComponent';
import SimpleCounterComponent from './components/SimpleCounterComponent';
import { Entity, System, SystemManager } from "../../src";
import CounterOnUpdateSystem from "./systems/CounterOnUpdateSystem";
class UpdateEntityOnEligibleSystem extends System {
    constructor() {
        super([SimpleComponent, SimpleCounterComponent]);
        this.counter = 0;
    }
    init() {
        return Promise.resolve(undefined);
    }
    onEligible(entity) {
        entity.getComponent(SimpleCounterComponent).counter++;
    }
    update() { }
}
describe('SystemManager', () => {
    let updateEntityOnEligibleSystem;
    let eligibleEntity;
    let notEligibleEntity;
    beforeEach(() => {
        updateEntityOnEligibleSystem = new UpdateEntityOnEligibleSystem();
        eligibleEntity = new Entity();
        notEligibleEntity = new Entity();
    });
    describe('Update', () => {
        it('should update the systems once', () => __awaiter(void 0, void 0, void 0, function* () {
            const counterOnUpdateSystem = new CounterOnUpdateSystem();
            yield SystemManager.addSystem(counterOnUpdateSystem);
            SystemManager.update();
            assert.equal(counterOnUpdateSystem.counter, 1);
        }));
        it('should update only eligible entities', () => __awaiter(void 0, void 0, void 0, function* () {
            updateEntityOnEligibleSystem = new UpdateEntityOnEligibleSystem();
            yield SystemManager.addSystem(updateEntityOnEligibleSystem);
            eligibleEntity.addComponent(new SimpleCounterComponent());
            eligibleEntity.addComponent(new SimpleComponent());
            notEligibleEntity.addComponent(new SimpleCounterComponent());
            SystemManager.update();
            assert.equal(eligibleEntity.getComponent(SimpleCounterComponent).counter, 1);
            assert.equal(notEligibleEntity.getComponent(SimpleCounterComponent).counter, 0);
        }));
    });
});
//# sourceMappingURL=SystemManager.spec.js.map