import { System } from "../../../src/ecs";
/**
 * Empty system
 */
export default class EmptySystem extends System {
    constructor() {
        super([]);
    }
    init() {
        return Promise.resolve(undefined);
    }
    update() {
    }
}
//# sourceMappingURL=EmptySystem.js.map