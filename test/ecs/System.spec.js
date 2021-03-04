import { assert } from 'chai';
import SimpleComponent from './components/SimpleComponent';
import { Entity, System } from "../../src";
class UpdateEntityOnEligibleSystem extends System {
    constructor() {
        super([SimpleComponent]);
    }
    init() {
        return Promise.resolve(undefined);
    }
    update() {
    }
}
describe('System', () => {
    describe('Eligiblity', () => {
        const system = new UpdateEntityOnEligibleSystem();
        it('should be eligible', () => {
            const eligibleEntity = new Entity();
            eligibleEntity.addComponent(new SimpleComponent());
            const eligibility = system.isEligible(eligibleEntity);
            assert.isTrue(eligibility);
        });
        it('should not be eligible', () => {
            const eligibleEntity = new Entity();
            const eligibility = system.isEligible(eligibleEntity);
            assert.isFalse(eligibility);
        });
    });
});
//# sourceMappingURL=System.spec.js.map