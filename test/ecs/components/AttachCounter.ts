import {Component, Entity} from '../../../src/ecs';

/**
 * Component that tracks the number of time it was attached to an entity
 */
export default class AttachCounter extends Component {
  public counter: number;

  public constructor() {
    super();
    this.counter = 0;
  }

  public onAddedToEntity(entity: Entity) {
    this.counter++;
  }
}
