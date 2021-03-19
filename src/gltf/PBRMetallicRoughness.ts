import { vec4 } from 'gl-matrix';
import { GLTFOptions } from './Gltf';
import Texture from './Texture';
import { TextureInfo } from './TextureInfo';

export interface PBRMetallicRoughnessOptions extends GLTFOptions {
  baseColorFactor?: vec4;
  baseColorTexture?: TextureInfo;
  metallicFactor?: number;
  roughnessFactor?: number;
  metallicRoughnessTexture?: TextureInfo;
}

export default class PBRMetallicRoughness {
  #baseColorFactor: vec4;

  #metallicFactor: number;

  #roughnessFactor: number;

  #baseColorTextureInfo?: TextureInfo;

  #metallicRoughnessTextureInfo?: TextureInfo;

  public constructor(options?: PBRMetallicRoughnessOptions) {
    this.#baseColorFactor = options?.baseColorFactor ?? [1, 1, 1, 1];
    this.#metallicFactor = options?.metallicFactor ?? 1;
    this.#roughnessFactor = options?.roughnessFactor ?? 1;
    this.#baseColorTextureInfo = options?.baseColorTexture;
    this.#metallicRoughnessTextureInfo = options?.metallicRoughnessTexture;
  }

  // TODO: refactor
  public static fromJSON(json: any, textures: Texture[]): PBRMetallicRoughness {
    return new PBRMetallicRoughness({
      baseColorFactor: [json.baseColorFactor[0], json.baseColorFactor[1], json.baseColorFactor[2], json.baseColorFactor[3]] || [0.51, 0.51, 0.51, 1],
      baseColorTexture: TextureInfo.fromJSON(json.baseColorTextureInfo, textures),
      metallicFactor: json.metallicFactor,
      roughnessFactor: json.roughnessFactor,
      metallicRoughnessTexture: TextureInfo.fromJSON(json.metallicRoughnessTextureInfo, textures),
    });
  }

  public get baseColorFactor(): vec4 {
    return this.#baseColorFactor;
  }

  public set baseColorFactor(value: vec4) {
    this.#baseColorFactor = value;
  }

  public get baseColorTextureInfo(): TextureInfo | undefined {
    return this.#baseColorTextureInfo;
  }

  public get metallicRoughnessTextureInfo(): TextureInfo | undefined {
    return this.#metallicRoughnessTextureInfo;
  }

  public get metallicFactor(): number {
    return this.#metallicFactor;
  }

  public get roughnessFactor(): number {
    return this.#roughnessFactor;
  }

  public set baseColorTextureInfo(value: TextureInfo | undefined) {
    this.#baseColorTextureInfo = value;
  }

  public set metallicFactor(value: number) {
    this.#metallicFactor = value;
  }

  public set roughnessFactor(value: number) {
    this.#roughnessFactor = value;
  }

  public set metallicRoughnessTextureInfo(value: TextureInfo | undefined) {
    this.#metallicRoughnessTextureInfo = value;
  }

  public clone() {
    return new PBRMetallicRoughness({
      baseColorFactor: vec4.clone(this.baseColorFactor),
      baseColorTexture: this.#baseColorTextureInfo,
      metallicFactor: this.#metallicFactor,
      roughnessFactor: this.#roughnessFactor,
      metallicRoughnessTexture: this.#metallicRoughnessTextureInfo,
    });
  }
}
