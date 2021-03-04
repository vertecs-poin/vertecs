import { System } from "../../../src";
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
//# sourceMappingURL=CounterOnUpdateSystem.js.map
