import Accessor from './Accessor';
import Buffer from './Buffer';
import BufferView from './BufferView';
import GLTFExtension from './GLTFExtension';
import Material from './Material';
import NodeFactory from './NodeFactory';
import Sampler from './Sampler';
import Scene from './Scene';
import Skin from './skinning/Skin';
import Texture from './Texture';
import CameraLens from './CameraLens';
import Entity from '../ecs/Entity';
import MeshFactory from './MeshFactory';
import FileUtils from '../utils/FileUtils';

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

export default class Gltf {
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
		const cameras: CameraLens[] = [];

		const requiredExtensions = json.extensionsRequired;
		const extensions = options?.extensions;

		// Throw an error when a required extension is not implemented
		requiredExtensions?.forEach((requiredExtension: string) => {
			if (!extensions?.find((extensionLoader) => extensionLoader.$name === requiredExtension)) {
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

		const bufferViews = json.bufferViews.map((bufferView: any) => BufferView.fromJSON(bufferView, buffers));

		const imagePromises = json.images?.map((image: any) => {
			if (image.uri) {
				return FileUtils.loadImageFromUri(image.uri);
			}
			return createImageBitmap(
				new Blob(
					[bufferViews[image.bufferView].getArrayBuffer(image.byteLength)],
					{type: json.mimeType}
				)
			);
		}) || [];
		const images: ImageBitmap[] = await Promise.all(imagePromises);

		const accessors = json.accessors?.map((accessor: any) => Accessor.fromJson(accessor, bufferViews));
		const samplers = json.samplers?.map((sampler: any) => Sampler.fromJSON(sampler));
		const textures = json.textures?.map((texture: any) => Texture.fromJSON(texture, samplers, images));
		const materials = json.materials?.map((material: any) => Material.fromJson(material, textures));
		const meshes = json.meshes?.map((mesh: any) => MeshFactory.fromJson(mesh, accessors, materials));
		const nodes = json.nodes?.map((node: any) => NodeFactory.fromJson(node, cameras, meshes, extensions));
		const skins = json.skins?.map((skin: any) => Skin.fromJson(skin, accessors[skin.inverseBindMatrices], nodes));

		const scene = Scene.fromJSON(json.scenes[json.scene ?? 0], nodes);
		const gltf = new Entity();
		gltf.addChild(scene);

		// Set up nodes hierarchy
		json.nodes.forEach((node: any, nodeIndex: any) => {
			node.children?.forEach((child: any, childIndex: any) => nodes[nodeIndex].addChild(nodes[childIndex]));
		});

		return gltf;
	}

	public static toJSON(gltf: Entity): any {
		return {
			extensionsUsed: undefined,
			extensionsRequired: undefined,
			accessors: undefined,
			animations: undefined,
			asset: {
				version: '2.0',
				generator: 'VertECS Exporter'
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
