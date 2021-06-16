import GltfObject from "./GltfObject";
import GltfExtension from "./GltfExtension";
import FileUtils from "../utils/FileUtils";
import { Format, GltfOptions } from "./GltfFactory";

export interface BufferJson extends GltfOptions {
  uri: string;
  byteLength: number;
}

export default class Buffer extends GltfObject {
  /**
   * The binary geometry, animation, or skins data.
   * @private
   */
  #data: ArrayBuffer;

  /**
   * The length of the buffer in bytes.
   * @private
   */
  #byteLength: number;

  public constructor(data: ArrayBuffer, byteLength: number, options?: GltfOptions) {
    super(options);

    this.#data = data;
    this.#byteLength = byteLength;
  }

  public static async fromJson(json: BufferJson, path?: string): Promise<Buffer> {
    const buffer = await FileUtils.loadArrayBufferFromUri((path ?? "") + json.uri);
    if (!buffer) {
      throw new Error("Gltf import error: Buffer data not found");
    }

    return new Buffer(buffer, buffer.byteLength, { ...json });
  }

  public static toJson(buffer: Buffer, format: Format, extensions?: GltfExtension[]): BufferJson {
    switch (format) {
      case Format.Embedded: {
        return {
          uri: "",
          byteLength: buffer.byteLength,
          name: buffer.name,
          extensions: extensions?.map((extension) => extension.exportBuffer(buffer)),
          extras: undefined
        };
      }
      default: {
        throw new Error("Format not supported yet");
      }
    }
  }

  public get data(): ArrayBuffer {
    return this.#data;
  }

  public set data(value: ArrayBuffer) {
    this.#data = value;
  }

  public get byteLength(): number {
    return this.#byteLength;
  }

  public set byteLength(value: number) {
    this.#byteLength = value;
  }
}
