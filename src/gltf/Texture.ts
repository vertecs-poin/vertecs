import { Format, GLTFOptions } from "./Gltf";
import GLTFExtension from './GLTFExtension';
import GLTFObject from './GLTFObject';
import Sampler from './Sampler';

interface TextureOptions extends GLTFOptions {
  sampler?: Sampler,
  source?: ImageBitmap,
}

/**
 * A texture and its sampler
 */
export default class Texture extends GLTFObject {
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

  public static fromJSON(json: any, samplers: Sampler[], images: ImageBitmap[]): Texture {
    return new Texture({
      sampler: samplers[json.sampler] ?? new Sampler(),
      source: images[json.source],
      name: json.name,
      extensions: json.extensions,
      extras: json.extras
    });
  }

  public static toJSON(texture: Texture, samplers: Sampler[], images: ImageBitmap[], format: Format, extensions?: GLTFExtension[]): any {
    return {
      sampler: undefined,
      source: undefined,
      name: texture.name,
      extensions: extensions?.map(extension => extension.exportTexture(texture)),
      extras: undefined,
    };
  }

  public get sampler(): Sampler {
    return this.#sampler;
  }

  public set sampler(value: Sampler) {
    this.#sampler = value;
  }
}
