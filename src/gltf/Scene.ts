import Transform from '../math/components/Transform';
import GltfExtension from './GltfExtension';
import { Entity } from "../ecs";

export default class Scene {
  public static fromJson(json: any, nodes: Entity[]): Entity {
    const scene = new Entity({ name: json.name });
    scene.addComponent(new Transform());
    json.nodes.forEach((node: any) => scene.addChild(nodes[node]));
    return scene;
  }

  public static toJson(entity: Entity, extensionHandlers?: GltfExtension[]): any {
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
      extras: undefined,
    };
  }
}
