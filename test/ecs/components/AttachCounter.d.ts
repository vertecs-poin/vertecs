import { Entity } from '../../../dist';
import { Component } from '../../../src';
/**
 * Component that tracks the number of time it was attached to an entity
 */
export default class AttachCounter extends Component {
    counter: number;
    constructor();
    onAddedToEntity(entity: Entity): void;
}
//# sourceMappingURL=AttachCounter.d.ts.map