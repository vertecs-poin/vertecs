import Entity from "../ecs/Entity";
import Transform from "../math/components/Transform";
import CameraComponent from "./CameraComponent";
import GLTFExtension from "./GLTFExtension";
import Primitive from "./Primitive";
import Mesh from "./Mesh";
import { AnimationComponent } from "../animation";

export default class NodeFactory {
  public static fromJson(json: any, cameras: CameraComponent[], meshes: Mesh[], extensionHandlers?: GLTFExtension[]): Entity {
    const node = new Entity({ name: json.name });

    let transform;
    if (json.matrix) {
      transform = Transform.fromMat4(json.matrix);
    } else {
      transform = new Transform(
        undefined,
        json.translation?.map(Number),
        json.rotation?.map(Number),
        json.scale?.map(Number)
      );
    }
    node.addComponent(transform);

    const camera = cameras[json.camera];
    if (camera) {
      node.addComponent(camera);
    }

    const mesh = meshes[json.mesh];
    if (mesh) {
      node.addComponent(mesh);
    }

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
    const cameraLens = node.getComponent(CameraComponent);

    return {
      camera: undefined,
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
      extras: undefined
    };
  }
}
