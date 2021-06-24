import { vec3, vec4 } from "gl-matrix";
import Component from "../ecs/Component";
import { GltfOptions } from "./GltfFactory";
import PbrMetallicRoughness, { PbrMetallicRoughnessJson } from "./PbrMetallicRoughness";
import Texture from "./Texture";
import { TextureInfo, TextureInfoJson } from "./TextureInfo";
import { PrimitiveJson } from "./Primitive";

interface MaterialOptions extends GltfOptions {
  pbrMetallicRoughness?: PbrMetallicRoughness,
  normalTexture?: TextureInfo,
  occlusionTexture?: TextureInfo,
  emissiveTexture?: TextureInfo,
  emissiveFactor?: vec3,
  alphaMode?: string,
  alphaCutoff?: number,
  doubleSided?: boolean
}

export interface MaterialJson {
  pbrMetallicRoughness: PbrMetallicRoughnessJson;
  normalTexture?: TextureInfoJson,
  occlusionTexture?: TextureInfoJson,
  emissiveTexture?: TextureInfoJson,
  emissiveFactor?: vec3,
  alphaMode?: string,
  alphaCutoff?: number,
  doubleSided?: boolean
}

export enum AlphaMode {
  "OPAQUE", "BLEND", "MASK"
}

export default class Material {
  #pbrMetallicRoughness: PbrMetallicRoughness;

  #normalTexture?: TextureInfo;

  #occlusionTexture?: TextureInfo;

  #emissiveTexture?: TextureInfo;

  #emissiveFactor: vec3;

  #alphaMode: AlphaMode;

  #alphaCutoff: number;

  #doubleSided: boolean;

  public constructor(options?: MaterialOptions) {
    this.#pbrMetallicRoughness = options?.pbrMetallicRoughness ?? new PbrMetallicRoughness();
    this.#normalTexture = options?.normalTexture;
    this.#occlusionTexture = options?.occlusionTexture;
    this.#emissiveTexture = options?.emissiveTexture;
    switch (options?.alphaMode) {
      case "OPAQUE": {
        this.#alphaMode = AlphaMode.OPAQUE;
        break;
      }
      case "BLEND": {
        this.#alphaMode = AlphaMode.BLEND;
        break;
      }
      case "MASK": {
        this.#alphaMode = AlphaMode.MASK;
        break;
      }
      default: {
        this.#alphaMode = AlphaMode.OPAQUE;
        break;
      }
    }
    this.#alphaCutoff = options?.alphaCutoff ?? 0.5;
    this.#doubleSided = options?.doubleSided ?? false;
    this.#emissiveFactor = options?.emissiveFactor ?? [1, 1, 1];
  }

  public static fromBitmap(bitmap: ImageBitmap) {
    const material = new Material();
    material.#pbrMetallicRoughness.baseColorTextureInfo = new TextureInfo(Texture.fromBitMap(bitmap), 0);
    return material;
  }

  public static fromJson(json: MaterialJson, textures: Texture[]): Material {
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
      alphaCutoff: json.alphaCutoff,
      doubleSided: json.doubleSided
    });
  }

  /**
   * Creates a material from a base color factor
   * @param baseColorFactor
   */
  public static fromBaseColor(baseColorFactor: vec4): Material {
    return new Material({
      pbrMetallicRoughness: new PbrMetallicRoughness({ baseColorFactor })
    });
  }

  public static toJson(json: PrimitiveJson) {
    throw new Error("Not yet implemented");
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

  public get alphaMode(): AlphaMode {
    return this.#alphaMode;
  }

  public set alphaMode(value: AlphaMode) {
    this.#alphaMode = value;
  }

  public get alphaCutOff(): number {
    return this.#alphaCutoff;
  }

  public set alphaCutOff(value: number) {
    this.#alphaCutoff = value;
  }

  public get doubleSided(): boolean {
    return this.#doubleSided;
  }

  public set doubleSided(value: boolean) {
    this.#doubleSided = value;
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
}
