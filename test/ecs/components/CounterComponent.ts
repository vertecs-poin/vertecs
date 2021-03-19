import { Component } from "../../../src/ecs";

/**
 * Simple component with a counter and increment method
 */
export default class CounterComponent extends Component {
  public counter: number;

  public constructor() {
    super();
    this.counter = 0;
  }

  public increment() {
    this.counter++;
  }
}
