import {System} from '../../../src/ecs';

/**
 * Empty system
 */
export default class EmptySystem extends System {

	public constructor() {
		super([]);
	}

	init(): Promise<void> {
		return Promise.resolve(undefined);
	}

	update(): void {
	}
}
