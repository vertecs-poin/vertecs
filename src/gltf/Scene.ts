import {Transform} from '../math';
import GLTFExtension from './GLTFExtension';
import {Entity} from '../ecs';

export default class Scene {
	public static fromJSON(json: any, nodes: Entity[]): Entity {
		const scene = new Entity({name: json.name});
		scene.addComponent(new Transform());
		json.nodes.forEach((node: any) => scene.addChild(nodes[node]));
		return scene;
	}

	public static toJSON(entity: Entity, extensionHandlers?: GLTFExtension[]): any {
		const extensions: any[] = [];
		extensionHandlers?.forEach((extensionHandler) => {
			const extension = extensionHandler.exportScene(entity);
			if (extension) {
				extensions.push(extension);
			}
		});

		return {
			nodes: undefined,
			name: entity.name,
			extensions,
			extras: undefined
		};
	}
}
