import GLTFObject from "./GLTFObject";
import Buffer from "./Buffer";
import GLTFExtension from "./GLTFExtension";
import { Format, GLTFOptions } from "./Gltf";

type BufferViewOptions = GLTFOptions & {
  byteOffset?: number,
  byteStride?: number,
  target?: number
}

export default class BufferView extends GLTFObject {
  /**
   * The target buffer
   * @private
   */
  #buffer: Buffer;

  /**
   * The offset into the buffer in bytes.
   * @private
   */
  #byteOffset: number;

  /**
   * The length of the bufferView in bytes.
   * @private
   */
  #byteLength: number;

  /**
   * The stride, in bytes.
   * @private
   */
  #byteStride: number;

  /**
   * The target that the GPU buffer should be bound to.
   * @private
   */
  #target: number;

  public constructor(buffer: Buffer, byteLength: number, options?: BufferViewOptions) {
    super(options);
    this.#buffer = buffer;
    this.#byteLength = byteLength;
    this.#target = options?.target ?? 0;
    this.#byteOffset = options?.byteOffset ?? 0;
    this.#byteStride = options?.byteStride ?? 0;
  }

  public static fromJSON(json: any, buffers: Buffer[]): BufferView {
    const buffer = buffers[json.buffer];
    return new BufferView(buffer, json.byteLength, { ...json });
  }

  public static toJSON(bufferView: BufferView, format: Format, extensions?: GLTFExtension[]): any {
    return {
      name: bufferView.name,
      buffer: Buffer.toJson(bufferView.buffer, format),
      byteOffset: bufferView.byteOffset,
      byteLength: bufferView.byteLength,
      byteStride: bufferView.byteStride,
      target: bufferView.target,
      extensions: extensions?.map((extension) => extension.exportBufferView(bufferView)),
      extras: bufferView.extras
    };
  }

  public getArrayBuffer(byteLength = this.byteLength, byteOffset = 0): ArrayBuffer {
    const result = new ArrayBuffer(byteLength);
    const resultView = new Int8Array(result);

    const dataView = new Int8Array(this.#buffer.data);

    let index = this.#byteOffset + byteOffset;
    for (let i = 0; i < byteLength; i++) {
      if (this.#byteStride > 0) {
        // realign index at next vertex
        index = i * this.#byteStride;
      }
      resultView[i] = dataView[index++];
    }

    return result;
  }

  public get target(): number {
    return this.#target;
  }

  public set target(value: number) {
    this.#target = value;
  }

  public get byteOffset(): number {
    return this.#byteOffset;
  }

  public get byteLength(): number {
    return this.#byteLength;
  }

  public get byteStride(): number {
    return this.#byteStride;
  }

  public get buffer(): Buffer {
    return this.#buffer;
  }

  public set buffer(value: Buffer) {
    this.#buffer = value;
  }

  public set byteOffset(value: number) {
    this.#byteOffset = value;
  }

  public set byteLength(value: number) {
    this.#byteLength = value;
  }

  public set byteStride(value: number) {
    this.#byteStride = value;
  }
}
