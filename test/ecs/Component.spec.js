import { assert } from 'chai';
import { Component } from "../../src";
class SimpleComponent extends Component {
}
describe('Component', () => {
    describe('ID', () => {
        it('should not have the same ID', () => {
            const firstComponent = new SimpleComponent();
            const secondComponent = new SimpleComponent();
            assert.notEqual(firstComponent.id, secondComponent.id);
        });
    });
});
//# sourceMappingURL=Component.spec.js.map