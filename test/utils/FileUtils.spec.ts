import {assert} from 'chai';
import {Entity} from '../../src/ecs';
import {Transform} from '../../src/math';

describe('FileUtils', () => {
	const entity = new Entity();
	let transform: Transform;

	beforeEach(() => {
		transform = new Transform();
		entity.addComponent(transform);
	});

	describe('Data uri', () => {
		it('should load the correct data', () => {
			assert.fail();
		});
	});
});
