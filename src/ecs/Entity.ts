import Component from './Component';

export default class Entity {
	public id: number;
	public name?: string;
	public children: Entity[];
	public parent?: Entity;

	constructor(json?: any) {
		this.id = 0;
		this.children = [];
	}

	public addComponent(component: Component): any {
		component.onAddedToEntity(this);
	}

	public getComponents(param?: Function[]): Component[] {
		throw new Error('');
	}

	public removeComponent(component: Function) {

	}

	public clone(): Entity {
		throw new Error('');
	}

	public addChild(entity1: Entity) {

	}

	public getComponent(component: Function): any {
		throw new Error('');
	}
}
