import Entity from "../ecs/Entity";
import Transform from "../math/components/Transform";
import CameraComponent from "./CameraComponent";
import GltfExtension from "./GltfExtension";
import Mesh from "./Mesh";
import { GltfOptions } from "./GltfFactory";

export interface NodeJson extends GltfOptions {
  camera?: number;
  children?: number[];
  skin?: number;
  matrix?: number[];
  mesh?: number;
  rotation?: number[];
  scale?: number[];
  translation?: number[];
  weights?: number[];
}

export default class NodeFactory {
  public static DEFAULT_MATRIX = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  public static DEFAULT_ROTATION = [0, 0, 0, 1];
  public static DEFAULT_SCALE = [1, 1, 1];
  public static DEFAULT_TRANSLATION = [0, 0, 0];

  public static fromJson(json: NodeJson, cameras: CameraComponent[], meshes: Mesh[], extensionHandlers?: GltfExtension[]): Entity {
    const node = new Entity({ name: json.name });

    let transform;
    if (json.matrix) {
      // @ts-ignore
      transform = Transform.fromMat4(json.matrix ?? NodeFactory.DEFAULT_MATRIX);
    } else {
      transform = new Transform(
        undefined,
        // @ts-ignore
        json.translation?.map(Number) ?? NodeFactory.DEFAULT_TRANSLATION,
        json.rotation?.map(Number) ?? NodeFactory.DEFAULT_ROTATION,
        json.scale?.map(Number) ?? NodeFactory.DEFAULT_SCALE
      );
    }
    node.addComponent(transform);

    const camera = cameras[json.camera ?? 0];
    if (camera) {
      node.addComponent(camera);
    }

    if (json.extensions) {
      extensionHandlers?.forEach((handler) => {
        const extension = json.extensions?.find((extension: string) => extension === handler.$name);
        if (extension) handler.importNode(node, extension);
      });
    }

    return node;
  }

  public static toJson(node: Entity, extensions?: GltfExtension[]): NodeJson {
    const children = [];
    node.children.forEach(child => {
      // Check if child is a Node
      // TODO: Check why primitive is not a component
      // if (child.getComponent(Primitive)) {
      //   children.push(NodeFactory.toJson(child, extensions));
      // }
    });

    const transform = node.getComponent(Transform);
    const cameraLens = node.getComponent(CameraComponent);

    // TODO: check IndexedCollection
    return {
      children: [],
      matrix: undefined,
      rotation: [1, 0, 0, 1],
      scale: [1, 0, 1],
      translation: [1, 1, 1],
      name: node.name,
      extensions: extensions?.map((extension) => extension.exportNode(node)),
      extras: undefined, camera: 0, mesh: 0, skin: 0, weights: []
    };
  }
}
