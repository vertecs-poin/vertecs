import GLTFExtension from './GLTFExtension';
import Texture from './Texture';

export class TextureInfo {
  #texture: Texture;

  #texCoord: number;

  public constructor(texture: Texture, texCoord?: number) {
    this.#texture = texture;
    this.#texCoord = texCoord || 0;
  }

  public static fromJSON(json: any, textures: Texture[]): TextureInfo {
    return new TextureInfo(
      textures[json.index],
      json.texCoord,
    );
  }

  public static toJSON(textureInfo: TextureInfo, textures: Texture[], extensionHandlers?: GLTFExtension[]): any {
    const extensions: any[] = [];
    extensionHandlers?.forEach((extensionHandler) => {
      const extension = extensionHandler.exportTextureInfo(textureInfo);
      if (extension) {
        extensions.push(extension);
      }
    });

    return {
      undefined,
      textureInfo,
      extensions,
    };
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
