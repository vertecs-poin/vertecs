import Accessor, { AccessorJson } from "./Accessor";
import Buffer, { BufferJson } from "./Buffer";
import BufferView, { BufferViewJson } from "./BufferView";
import GltfExtension from "./GltfExtension";
import Material, { MaterialJson } from "./Material";
import NodeFactory, { NodeJson } from "./NodeFactory";
import Sampler, { SamplerJson } from "./Sampler";
import Scene from "./Scene";
import Texture, { TextureJson } from "./Texture";
import Entity from "../ecs/Entity";
import Mesh, { MeshJson } from "./Mesh";
import FileUtils from "../utils/FileUtils";
import AnimationSamplerFactory from "../animation/AnimationSamplerFactory";
import AnimationComponent from "../animation/components/AnimationComponent";
import AnimationChannel from "../animation/AnimationChannel";
import Animation from "../animation/Animation";
import CameraComponent, { CameraJson } from "./CameraComponent";
import SkinFactory, { SkinJson } from "./SkinFactory";
import { Transform } from "../math";
import { ImageJson } from "./ImageJson";
import AnimationJson from "./animation/AnimationJson";

export type GltfOptions = {
  name?: string;
  extensions?: any;
  extras?: any;
}

export enum Format {
  Binary,
  Embedded,
  Separated
}

export interface GltfJson extends GltfOptions {
  asset?: {
    version?: string,
    generator?: string
  },
  scene?: number;
  extensionsRequired?: any;
  extensionsUsed?: any;
  buffers: BufferJson[];
  bufferViews: BufferViewJson[];
  images?: ImageJson[];
  cameras?: CameraJson[];
  accessors: AccessorJson[];
  samplers?: SamplerJson[];
  textures?: TextureJson[];
  materials?: MaterialJson[];
  meshes: MeshJson[];
  nodes: NodeJson[];
  skins?: SkinJson[];
  animations?: AnimationJson[];
  scenes: any;
}

export interface GltfImporterOptions {
  /**
   * The root folder, all files will be loaded relative to this folder
   */
  folder?: string;
  /**
   * The extensions to use for loading this gltf file, default to none
   */
  extensions?: GltfExtension[];
}

export default class GltfFactory {
  /**
   * A list of all supported extensions
   *
   */
  public static SUPPORTED_EXTENSIONS: string[] = [];

  private constructor() {
  }

  //TODO: path + file name for importing
  /**
   * Create a GLTF from a json file
   * @param json The json file
   * @param path The path where assets can be found
   * @param options Optional import options
   */
  public static async fromJson(json: GltfJson, path?: string, options?: GltfImporterOptions): Promise<Entity> {
    const requiredExtensions = json.extensionsRequired;
    const extensions = options?.extensions;

    // Throw an error when a required extension is not implemented
    requiredExtensions?.forEach((requiredExtension: string) => {
      if (!extensions?.find(extensionLoader => extensionLoader.$name === requiredExtension)) {
        throw new Error(`Extension not supported: ${requiredExtension}`);
      }
    });

    // Import all used extensions
    json.extensionsUsed?.forEach((extensionUsed: string) => {
      const extensionLoader = extensions?.find((extensionLoader) => extensionLoader.$name === extensionUsed);
      extensionLoader?.importExtension(extensionLoader);
    });

    const buffers: Buffer[] = [];
    if (json.buffers) {
      for await (const buffer of json.buffers) {
        buffers.push(await Buffer.fromJson(buffer, path));
      }
    }

    const bufferViews = json.bufferViews.map(bufferView => BufferView.fromJson(bufferView, buffers));

    const imagePromises = json.images?.map(image => {
      if (image.uri) {
        return FileUtils.loadImageFromUri((path ?? "") + image?.uri);
      }
      return createImageBitmap(
        new Blob(
          [bufferViews[image.bufferView!].getArrayBuffer(image.byteLength!)],
          { type: "" }
        )
      );
    }) || [];
    const images: ImageBitmap[] = await Promise.all(imagePromises);

    const cameras = json.cameras?.map(camera => CameraComponent.fromJson(camera)) || [];
    const accessors = json.accessors?.map(accessor => Accessor.fromJson(accessor, bufferViews));
    const samplers = json.samplers?.map(sampler => new Sampler(sampler)) || [];
    const textures = json.textures?.map(texture => Texture.fromJson(texture, samplers, images)) || [];
    const materials = json.materials?.map(material => Material.fromJson(material, textures)) || [];
    const meshes = json.meshes?.map(mesh => Mesh.fromJson(mesh, accessors, materials)) || [];
    const nodes = json.nodes?.map(json => NodeFactory.fromJson(json, cameras, meshes, extensions));
    const skins = json.skins?.map((skin, i) => {
      // Ignore skeleton https://github.com/KhronosGroup/glTF/issues/1270

      // Assume skins are always attached to mesh
      const nodeIndex = json.nodes.findIndex(node => node.skin === i);
      const transformOfNodeThatTheMeshIsAttachedTo = nodes[nodeIndex].getComponent(Transform);
      if (!transformOfNodeThatTheMeshIsAttachedTo) {
        throw new Error(`transformOfNodeThatTheMeshIsAttachedTo not found with index ${nodeIndex}`);
      }
      return SkinFactory.fromJson(
        skin,
        transformOfNodeThatTheMeshIsAttachedTo,
        nodes,
        skin.inverseBindMatrices ? accessors[skin.inverseBindMatrices] : undefined);
    });

    // Add skins to nodes
    json.nodes.forEach((nodeJson, i) => {
      const node = nodes[i];

      if (nodeJson.skin !== undefined && skins) {
        const skin = skins[nodeJson.skin];
        nodes[i].addComponent(skin);
      }

      if (nodeJson.mesh !== undefined) {
        node.addComponent(meshes[nodeJson.mesh]);
      }
    });

    const gltf = new Entity({ name: "Gltf model" });
    gltf.addComponent(new Transform());
    const animationComponent = new AnimationComponent();
    gltf.addComponent(animationComponent);

    json.animations?.forEach(animationJson => {
      const animation = new Animation();

      const samplers = animationJson.samplers.map(sampler => AnimationSamplerFactory.fromJson(sampler, accessors));

      animationJson.channels.forEach(channel => {
        // Attach all samplers to entities
        const node = nodes[channel.target.node];

        const sampler = samplers[channel.sampler];
        animation.channels.push(new AnimationChannel(node, channel.target.path, sampler));
      });

      animationComponent.animations.push(animation);
    });

    const scene = Scene.fromJson(json.scenes[json.scene ?? 0], nodes);
    gltf.addChild(scene);

    // Set up nodes hierarchy
    json.nodes.forEach((node, nodeIndex) => {
      node.children?.forEach((child: number) => nodes[nodeIndex].addChild(nodes[child]));
    });

    const cameraComponent = new CameraComponent("perspective");
    const defaultCameraEntity = new Entity();
    gltf.addChild(defaultCameraEntity);
    defaultCameraEntity.addComponent(new Transform(undefined, [0, 0, 2]));
    defaultCameraEntity.addComponent(cameraComponent);

    return gltf;
  }

  public static toJson(gltf: Entity): GltfJson {
    return {
      asset: {
        version: "2.0",
        generator: "Vertecs Exporter"
      },
      extensionsUsed: undefined,
      extensionsRequired: undefined,
      accessors: [],
      animations: [],
      buffers: [],
      bufferViews: [],
      cameras: [],
      images: [],
      materials: [],
      meshes: [],
      nodes: gltf.children.map(node => NodeFactory.toJson(node)),
      samplers: [],
      scene: 0,
      scenes: undefined,
      skins: [],
      textures: []
    };
  }
}
