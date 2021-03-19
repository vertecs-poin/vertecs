import { Component } from '../../../src';
/**
 * Component that tracks the number of time it was attached to an entity
 */
export default class AttachCounter extends Component {
    constructor() {
        super();
        this.counter = 0;
    }
    onAddedToEntity(entity) {
        this.counter++;
    }
}
//# sourceMappingURL=AttachCounter.js.map