import Accessor from "./Accessor";
import Buffer from "./Buffer";
import BufferView from "./BufferView";
import GLTFExtension from "./GLTFExtension";
import Material from "./Material";
import NodeFactory from "./NodeFactory";
import Sampler from "./Sampler";
import Scene from "./Scene";
import Skin from "./skinning/Skin";
import Texture from "./Texture";
import Entity from "../ecs/Entity";
import Mesh from "./Mesh";
import FileUtils from "../utils/FileUtils";
import AnimationSamplerFactory from "../animation/AnimationSamplerFactory";
import AnimationComponent from "../animation/components/AnimationComponent";
import AnimationSamplerTarget from "../animation/AnimationSamplerTarget";
import Animation from "../animation/Animation";
import CameraComponent from "./CameraComponent";

export type GLTFOptions = {
  extensions?: object;
  extras?: object;
  name?: any;
}

export enum Format {
  Binary,
  Embedded,
  Separated
}

export interface GltfImporterOptions {
  /**
   * The root folder, all files will be loaded relative to this folder
   */
  folder?: string;
  /**
   * The extensions to use for loading this gltf file, default to none
   */
  extensions?: GLTFExtension[];
}

export default class GLTFFactory {
  /**
   * A list of all supported extensions
   *
   */
  public static SUPPORTED_EXTENSIONS = [];

  private constructor() {
  }

  /**
   * Create a GLTF from a json file
   * @param json The json file
   * @param options Optional import options
   */
  public static async fromJson(json: any, options?: GltfImporterOptions): Promise<Entity | undefined> {
    const requiredExtensions = json.extensionsRequired;
    const extensions = options?.extensions;

    // Throw an error when a required extension is not implemented
    requiredExtensions?.forEach((requiredExtension: string) => {
      if (!extensions?.find(extensionLoader => extensionLoader.$name === requiredExtension)) {
        throw new Error(`Extension not supported: ${requiredExtension}`);
      }
    });

    // Import all used extensions
    json.extensionsUsed?.forEach((extensionUsed: any) => {
      const extensionLoader = extensions?.find((extensionLoader) => extensionLoader.$name === extensionUsed);
      extensionLoader?.importExtension(extensionLoader);
    });

    const buffers: Buffer[] = [];
    if (json.buffers) {
      for await (const buffer of json.buffers) {
        buffers.push(await Buffer.fromJson(buffer));
      }
    }

    const bufferViews = json.bufferViews.map((bufferView: any) => BufferView.fromJson(bufferView, buffers));

    const imagePromises = json.images?.map((image: any) => {
      if (image.uri) {
        return FileUtils.loadImageFromUri(image.uri);
      }
      return createImageBitmap(
        new Blob(
          [bufferViews[image.bufferView].getArrayBuffer(image.byteLength)],
          { type: json.mimeType }
        )
      );
    }) || [];
    const images: ImageBitmap[] = await Promise.all(imagePromises);

    const cameras: CameraComponent[] = json.cameras?.map((json: any) => CameraComponent.fromJSON(json)) || [];
    const accessors: Accessor[] = json.accessors?.map((json: any) => Accessor.fromJson(json, bufferViews));
    const samplers: Sampler[] = json.samplers?.map((json: any) => new Sampler(json));
    const textures: Texture[] = json.textures?.map((json: any) => Texture.fromJson(json, samplers, images));
    const materials: Material[] = json.materials?.map((json: any) => Material.fromJson(json, textures)) || [];
    const meshes: Mesh[] = json.meshes?.map((json: any) => Mesh.fromJson(json, accessors, materials));
    const nodes: Entity[] = json.nodes?.map((json: any) => NodeFactory.fromJson(json, cameras, meshes, extensions));
    const skins: Skin[] = json.skins?.map((json: any) => Skin.fromJson(json, accessors[json.inverseBindMatrices], nodes));

    json.animations?.forEach((animation: any, animationIndex: number) => {
      const samplers = animation.samplers.map((sampler: any) => AnimationSamplerFactory.fromJson(sampler, accessors));

      animation.channels.forEach((channel: any) => {
        // Attach all samplers to entities
        const node = nodes[channel.target.node];
        let animationComponent = node.getComponent(AnimationComponent);
        if (!animationComponent) {
          animationComponent = new AnimationComponent();
          node.addComponent(animationComponent);
        }

        let targetAnimation = animationComponent.animations[animationIndex];
        if (!targetAnimation) {
          targetAnimation = new Animation();
          animationComponent.animations.push(targetAnimation);
        }
        const targetSampler = samplers[channel.sampler];
        targetAnimation.targets.push(new AnimationSamplerTarget(channel.target.path, targetSampler));
      });
    });

    const scene = Scene.fromJson(json.scenes[json.scene ?? 0], nodes);
    const gltf = new Entity();
    gltf.addChild(scene);

    // Set up nodes hierarchy
    json.nodes.forEach((node: any, nodeIndex: any) => {
      node.children?.forEach((child: any, childIndex: any) => nodes[nodeIndex].addChild(nodes[childIndex]));
    });

    return gltf;
  }

  public static toJson(gltf: Entity): any {
    return {
      extensionsUsed: undefined,
      extensionsRequired: undefined,
      accessors: undefined,
      animations: undefined,
      asset: {
        version: "2.0",
        generator: "Vertecs Exporter"
      },
      buffers: undefined,
      bufferViews: undefined,
      cameras: undefined,
      images: undefined,
      materials: undefined,
      meshes: undefined,
      nodes: undefined,
      samplers: undefined,
      scene: 0,
      scenes: undefined,
      skins: undefined,
      textures: undefined,
      extensions: undefined,
      extras: undefined
    };
  }
}
