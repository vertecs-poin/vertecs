import Entity from './Entity';

export default abstract class System {
	private entities: any;

	protected constructor(components: Function[], tps?: number) {

	}

	public getEntities() {
		return this.entities;
	}

	public isEligible(entity: Entity) {

	}
}
