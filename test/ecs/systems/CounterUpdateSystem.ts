import {System} from '../../../src/ecs';

/**
 * System that tracks the number of times it has been updated
 */
export default class CounterUpdateSystem extends System {
	public counter: number;

	constructor() {
		super([]);
		this.counter = 0;
	}

	init(): Promise<void> {
		return Promise.resolve(undefined);
	}

	public update(): void {
		this.counter++;
	}
}
