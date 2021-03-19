import { Component } from "../../../src/ecs";
/**
 * Simple component with a counter and increment method
 */
export default class CounterComponent extends Component {
    constructor() {
        super();
        this.counter = 0;
    }
    increment() {
        this.counter++;
    }
}
//# sourceMappingURL=CounterComponent.js.map