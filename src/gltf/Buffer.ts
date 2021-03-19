import GLTFObject from "./GLTFObject";
import GLTFExtension from "./GLTFExtension";
import FileUtils from "../utils/FileUtils";
import { Format, GLTFOptions } from "./Gltf";

export default class Buffer extends GLTFObject {
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

  public constructor(data: ArrayBuffer, byteLength: number, options?: GLTFOptions) {
    super(options);

    this.#data = data;
    this.#byteLength = byteLength;
  }

  public static async fromJson(json: any): Promise<Buffer> {
    const buffer = await FileUtils.loadArrayBufferFromUri(json.uri);
    if (!buffer) {
      throw new Error("Gltf import error: Buffer data not found");
    }

    return new Buffer(buffer, buffer.byteLength, { ...json });
  }

  public static toJson(buffer: Buffer, format: Format, extensions?: GLTFExtension[]): any {
    switch (format) {
      case Format.Embedded: {
        return {
          name: buffer,
          data: buffer.data,
          byteLength: buffer.byteLength,
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

  public get byteLength(): number {
    return this.#byteLength;
  }

  public set data(value: ArrayBuffer) {
    this.#data = value;
  }

  public set byteLength(value: number) {
    this.#byteLength = value;
  }
}
