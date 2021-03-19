import { System } from "../../../src/ecs";
/**
 * System that tracks the number of times it has been updated
 */
export default class CounterUpdateSystem extends System {
    constructor() {
        super([]);
        this.counter = 0;
    }
    init() {
        return Promise.resolve(undefined);
    }
    update() {
        this.counter++;
    }
}
//# sourceMappingURL=CounterUpdateSystem.js.map