import {Entity} from './index';

export default abstract class Component {
	public static LAST_ID = 0;

	public id;

	constructor() {
		this.id = Component.LAST_ID++;
	}

	public onAddedToEntity(entity: Entity) {

	}
}
