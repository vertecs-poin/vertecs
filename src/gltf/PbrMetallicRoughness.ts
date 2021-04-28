import { vec4 } from "gl-matrix";
import { GLTFOptions } from "./GLTFFactory";
import Texture from "./Texture";
import { TextureInfo } from "./TextureInfo";

export interface PBRMetallicRoughnessOptions extends GLTFOptions {
  baseColorFactor?: vec4;
  baseColorTexture?: TextureInfo;
  metallicFactor?: number;
  roughnessFactor?: number;
  metallicRoughnessTexture?: TextureInfo;
}

export default class PbrMetallicRoughness {
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

  public static fromJson(json: any, textures: Texture[]): PbrMetallicRoughness {
    return new PbrMetallicRoughness({
      baseColorFactor: json.baseColorFactor ? [json.baseColorFactor[0], json.baseColorFactor[1], json.baseColorFactor[2], json.baseColorFactor[3]] : [1, 1, 1, 1],
      baseColorTexture: json.baseColorTexture && TextureInfo.fromJson(json.baseColorTexture, textures),
      metallicFactor: json.metallicFactor,
      roughnessFactor: json.roughnessFactor,
      metallicRoughnessTexture: json.metallicRoughnessTextureInfo && TextureInfo.fromJson(json.metallicRoughnessTextureInfo, textures)
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

  public set baseColorTextureInfo(value: TextureInfo | undefined) {
    this.#baseColorTextureInfo = value;
  }

  public get metallicRoughnessTextureInfo(): TextureInfo | undefined {
    return this.#metallicRoughnessTextureInfo;
  }

  public set metallicRoughnessTextureInfo(value: TextureInfo | undefined) {
    this.#metallicRoughnessTextureInfo = value;
  }

  public get metallicFactor(): number {
    return this.#metallicFactor;
  }

  public set metallicFactor(value: number) {
    this.#metallicFactor = value;
  }

  public get roughnessFactor(): number {
    return this.#roughnessFactor;
  }

  public set roughnessFactor(value: number) {
    this.#roughnessFactor = value;
  }

  public clone() {
    return new PbrMetallicRoughness({
      baseColorFactor: vec4.clone(this.baseColorFactor),
      baseColorTexture: this.#baseColorTextureInfo,
      metallicFactor: this.#metallicFactor,
      roughnessFactor: this.#roughnessFactor,
      metallicRoughnessTexture: this.#metallicRoughnessTextureInfo
    });
  }
}
