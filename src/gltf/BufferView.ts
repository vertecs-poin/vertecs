import GltfObject from "./GltfObject";
import Buffer from "./Buffer";
import GltfExtension from "./GltfExtension";
import { Format, GltfOptions } from "./GltfFactory";

type BufferViewOptions = GltfOptions & {
  byteOffset?: number,
  byteStride?: number,
  target?: number
}

export interface BufferViewJson extends GltfOptions {
  buffer: number;
  byteOffset: number;
  byteLength: number;
  target?: number;
}

export default class BufferView extends GltfObject {
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

  public static fromJson(json: any, buffers: Buffer[]): BufferView {
    const buffer = buffers[json.buffer];
    return new BufferView(buffer, json.byteLength, { ...json });
  }

  public static toJson(bufferView: BufferView, format: Format, extensions?: GltfExtension[]): any {
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

  public getArrayBuffer(elementLength: number, byteLength = this.byteLength, byteOffset = 0): ArrayBuffer {
    const result = new ArrayBuffer(byteLength);
    const resultView = new Int8Array(result);

    const dataView = new Int8Array(this.#buffer.data).slice(this.byteOffset, this.byteOffset + this.byteLength);

    if (this.#byteStride) {
      let sourceIndex = byteOffset;
      let destinationIndex = 0;
      const elementCount = byteLength / elementLength;
      for (let elementIndex = 0; elementIndex < elementCount; elementIndex++) {
        resultView.set(dataView.slice(sourceIndex, sourceIndex + elementLength), destinationIndex);
        sourceIndex += this.#byteStride;
        destinationIndex += elementLength;
      }
    } else {
      resultView.set(dataView.slice(byteOffset, byteOffset + byteLength), 0);
    }

    return result;
  }

  public getData(): ArrayBuffer {
    return this.#buffer.data.slice(this.#byteOffset, this.#byteOffset + this.#byteLength);
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

  public set byteOffset(value: number) {
    this.#byteOffset = value;
  }

  public get byteLength(): number {
    return this.#byteLength;
  }

  public set byteLength(value: number) {
    this.#byteLength = value;
  }

  public get byteStride(): number {
    return this.#byteStride;
  }

  public set byteStride(value: number) {
    this.#byteStride = value;
  }

  public get buffer(): Buffer {
    return this.#buffer;
  }

  public set buffer(value: Buffer) {
    this.#buffer = value;
  }
}
