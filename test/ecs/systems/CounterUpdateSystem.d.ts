import { System } from "../../../src/ecs";
/**
 * System that tracks the number of times it has been updated
 */
export default class CounterUpdateSystem extends System {
    counter: number;
    constructor();
    init(): Promise<void>;
    update(): void;
}
//# sourceMappingURL=CounterUpdateSystem.d.ts.map