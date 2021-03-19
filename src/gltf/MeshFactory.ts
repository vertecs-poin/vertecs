import Entity from '../ecs/Entity';
import {Transform} from '../math';
import Accessor from './Accessor';
import GLTFExtension from './GLTFExtension';
import Material from './Material';
import Primitive from './Primitive';

export default class MeshFactory {
	public static fromJson(json: any, accessors: Accessor[], materials: Material[]): Entity {
		const mesh = new Entity({name: json.name});
		mesh.addComponent(new Transform());

		for (const primitive of json.primitives) {
			const child = new Entity({name: primitive.name});
			if (primitive.material !== undefined) child.addComponent(materials[primitive.material]);
			child.addComponent(new Transform());
			child.addComponent(Primitive.fromJSON(primitive, accessors));

			mesh.addChild(child);
		}

		return mesh;
	}

	/**
	 * Export a mesh to a JSON format
	 * @param mesh The mesh entity
	 * @param primitives TODO:
	 * @param extensions The extensions used for exporting
	 */
	public static toJSON(mesh: Entity, primitives: any[], extensions?: GLTFExtension[]): any {
		return {
			name: mesh.name,
			extensions: extensions?.map((extension) => extension.exportMesh(mesh)),
			extras: undefined
		};
	}
}
