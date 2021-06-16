import GltfExtension from "./GltfExtension";
import Texture from "./Texture";

export interface TextureInfoJson {
  index: number;
  texCoord?: number;
}

export class TextureInfo {
  #texture: Texture;

  #texCoord: number;

  public constructor(texture: Texture, texCoord?: number) {
    this.#texture = texture;
    this.#texCoord = texCoord || 0;
  }

  public static fromJson(json: TextureInfoJson, textures: Texture[]): TextureInfo {
    const texture = textures[json.index];
    if (!texture) {
      throw new Error(`Texture with index ${json.index} not found !`);
    }
    return new TextureInfo(
      textures[json.index],
      json.texCoord
    );
  }

  public static toJson(textureInfo: TextureInfo, textures: Texture[], extensionHandlers?: GltfExtension[]): TextureInfoJson {
    const extensions: any[] = [];
    extensionHandlers?.forEach((extensionHandler) => {
      const extension = extensionHandler.exportTextureInfo(textureInfo);
      if (extension) {
        extensions.push(extension);
      }
    });

    throw new Error("Not yet implemented");
  }

  public get texture(): Texture {
    return this.#texture;
  }

  public set texture(value: Texture) {
    this.#texture = value;
  }

  public get texCoord(): number {
    return this.#texCoord;
  }

  public set texCoord(value: number) {
    this.#texCoord = value;
  }
}
