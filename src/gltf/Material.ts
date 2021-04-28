import { vec3, vec4 } from 'gl-matrix';
import Component from '../ecs/Component';
import { GLTFOptions } from './GLTFFactory';
import PbrMetallicRoughness from './PbrMetallicRoughness';
import Texture from './Texture';
import { TextureInfo } from './TextureInfo';

interface MaterialOptions extends GLTFOptions {
  pbrMetallicRoughness?: PbrMetallicRoughness,
  normalTexture?: TextureInfo,
  occlusionTexture?: TextureInfo,
  emissiveTexture?: TextureInfo,
  emissiveFactor?: vec3,
  alphaMode?: string,
  alphaCutOff?: number,
  doubleSided?: boolean
}

export default class Material extends Component {
  #pbrMetallicRoughness: PbrMetallicRoughness;

  #normalTexture?: TextureInfo;

  #occlusionTexture?: TextureInfo;

  #emissiveTexture?: TextureInfo;

  #emissiveFactor: vec3;

  #alphaMode: string;

  #alphaCutOff: number;

  #doubleSided: boolean;

  public constructor(options?: MaterialOptions) {
    super();
    this.#pbrMetallicRoughness = options?.pbrMetallicRoughness ?? new PbrMetallicRoughness();
    this.#normalTexture = options?.normalTexture;
    this.#occlusionTexture = options?.occlusionTexture;
    this.#emissiveTexture = options?.emissiveTexture;
    this.#alphaMode = options?.alphaMode ?? 'OPAQUE';
    this.#alphaCutOff = options?.alphaCutOff ?? 0.5;
    this.#doubleSided = options?.doubleSided ?? false;
    this.#emissiveFactor = options?.emissiveFactor ?? [1, 1, 1];
  }

  public static fromBitmap(bitmap: ImageBitmap) {
    const material = new Material();
    material.#pbrMetallicRoughness.baseColorTextureInfo = new TextureInfo(Texture.fromBitMap(bitmap), 0);
    return material;
  }

  public static fromJson(json: any, textures: Texture[]): Material {
    let emissiveFactor;
    if (json.emissiveFactor) {
      emissiveFactor = vec3.fromValues(json.emissiveFactor[0], json.emissiveFactor[1], json.emissiveFactor[2]);
    }

    return new Material({
      pbrMetallicRoughness: PbrMetallicRoughness.fromJson(json.pbrMetallicRoughness, textures),
      normalTexture: json.normalTexture && TextureInfo.fromJson(json.normalTexture, textures),
      occlusionTexture: json.occlusionTexture && TextureInfo.fromJson(json.occlusionTexture, textures),
      emissiveTexture: json.emissiveTexture && TextureInfo.fromJson(json.emissiveTexture, textures),
      emissiveFactor,
      alphaMode: json.alphaMode,
      alphaCutOff: json.alphaCutOff,
      doubleSided: json.doubleSided,
    });
  }

  /**
   * Creates a material from a base color factor
   * @param baseColorFactor
   */
  public static fromBaseColor(baseColorFactor: vec4): Material {
    return new Material({
      pbrMetallicRoughness: new PbrMetallicRoughness({ baseColorFactor }),
    });
  }

  public static toJson(json: any) {

  }

  public get baseColorFactor(): vec4 {
    return this.#pbrMetallicRoughness.baseColorFactor;
  }

  public set baseColorFactor(color: vec4) {
    vec4.copy(this.#pbrMetallicRoughness.baseColorFactor, color);
  }

  public get emissiveFactor(): vec3 {
    return this.#emissiveFactor;
  }

  public set emissiveFactor(emissiveFactor: vec3) {
    this.#emissiveFactor = emissiveFactor;
  }

  public get pbrMetallicRoughness(): PbrMetallicRoughness {
    return this.#pbrMetallicRoughness;
  }

  public get normalTexture(): TextureInfo | undefined {
    return this.#normalTexture;
  }

  public get occlusionTexture(): TextureInfo | undefined {
    return this.#occlusionTexture;
  }

  public get emissiveTexture(): TextureInfo | undefined {
    return this.#emissiveTexture;
  }

  public get alphaMode(): string {
    return this.#alphaMode;
  }

  public get alphaCutOff(): number {
    return this.#alphaCutOff;
  }

  public get doubleSided(): boolean {
    return this.#doubleSided;
  }

  public set pbrMetallicRoughness(value: PbrMetallicRoughness) {
    this.#pbrMetallicRoughness = value;
  }

  public set normalTexture(value: TextureInfo | undefined) {
    this.#normalTexture = value;
  }

  public set occlusionTexture(value: TextureInfo | undefined) {
    this.#occlusionTexture = value;
  }

  public set emissiveTexture(value: TextureInfo | undefined) {
    this.#emissiveTexture = value;
  }

  public set alphaMode(value: string) {
    this.#alphaMode = value;
  }

  public set alphaCutOff(value: number) {
    this.#alphaCutOff = value;
  }

  public set doubleSided(value: boolean) {
    this.#doubleSided = value;
  }
}
