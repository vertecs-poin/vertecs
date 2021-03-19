import Entity from '../ecs/Entity';
import {Transform} from '../math';
import CameraLens from './CameraLens';
import GLTFExtension from './GLTFExtension';
import Primitive from './Primitive';

export default class NodeFactory {
  public static fromJson(json: any, cameraLenses: CameraLens[], meshes: Entity[], extensionHandlers?: GLTFExtension[]): Entity {
    const node = new Entity({ name: json.name });

    let transform;
    if (json.matrix) {
      transform = Transform.fromMat4(json.matrix);
    } else {
      transform = new Transform(json.translation, json.rotation, json.scale);
    }
    node.addComponent(transform);

    const cameraLens = cameraLenses[json.camera];
    if (cameraLens) node.addComponent(cameraLens);

    const mesh = meshes[json.mesh];
    if (mesh) node.addChild(mesh);

    if (json.extensions) {
      extensionHandlers?.forEach((handler) => {
        const extension = json.extensions.find((extension: string) => extension === handler.$name);
        if (extension) handler.importNode(node, extension);
      });
    }

    return node;
  }

  public static toJSON(node: Entity, json: any, extensions?: GLTFExtension[]): any {
    const children = [];
    node.children.forEach((child) => {
      // Check if child is a Node
      if (child.getComponent(Primitive)) {
        children.push(NodeFactory.toJSON(child, {}, extensions));
      }
    });

    const transform = node.getComponent(Transform);

    return {
      camera: node.getComponent(CameraLens)?.toJSON(node, extensions),
      children: [],
      skin: undefined,
      matrix: undefined,
      mesh: undefined,
      rotation: transform?.rotation,
      scale: transform?.scaling,
      translation: transform?.position,
      weights: undefined,
      name: node.name,
      extensions: extensions?.map((extension) => extension.exportNode(node)),
      extras: undefined,
    };
  }
}
