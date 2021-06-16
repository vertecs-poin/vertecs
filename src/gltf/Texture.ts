import { Format, GltfOptions } from "./GltfFactory";
import GltfExtension from "./GltfExtension";
import GltfObject from "./GltfObject";
import Sampler from "./Sampler";

interface TextureOptions extends GltfOptions {
  sampler?: Sampler,
  source?: ImageBitmap,
}

export interface TextureJson extends GltfOptions {
  sampler: number;
  source: number;
}

/**
 * A texture and its sampler
 */
export default class Texture extends GltfObject {
  /**
   * The sampler used by this texture
   * @private
   */
  #sampler: Sampler;

  /**
   * The texture source
   * @private
   */
  #source: ImageBitmap;

  /**
   * Create a new Texture
   * @param options TODO: DOC
   */
  public constructor(options: TextureOptions) {
    super(options);
    this.#sampler = options?.sampler ?? new Sampler();
    this.#source = options?.source ?? new ImageBitmap(); // TODO: Default image when undefined
  }

  public static fromBitMap(bitmap: ImageBitmap): Texture {
    return new Texture({
      sampler: new Sampler(), source: bitmap
    });
  }

  public static fromJson(json: TextureJson, samplers: Sampler[], images: ImageBitmap[]): Texture {
    return new Texture({
      sampler: samplers[json.sampler] ?? new Sampler(),
      source: images[json.source],
      name: json.name,
      extensions: json.extensions,
      extras: json.extras
    });
  }

  public static toJson(texture: Texture, samplers: Sampler[], images: ImageBitmap[], format: Format, extensions?: GltfExtension[]): TextureJson {
    throw new Error("Not yet implemented");
  }

  public get sampler(): Sampler {
    return this.#sampler;
  }

  public set sampler(value: Sampler) {
    this.#sampler = value;
  }

  public get source(): ImageBitmap {
    return this.#source;
  }

  public set source(value: ImageBitmap) {
    this.#source = value;
  }
}
