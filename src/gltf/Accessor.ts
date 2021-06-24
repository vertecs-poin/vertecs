import BufferView from "./BufferView";
import GltfObject from "./GltfObject";
import GltfExtension from "./GltfExtension";
import { Format, GltfOptions } from "./GltfFactory";
import Buffer from "./Buffer";

interface AccessorOptions extends GltfOptions {
  byteOffset?: number;
  normalized?: boolean;
  min?: number[];
  max?: number[];
  sparse?: object;
}

export interface AccessorJson extends GltfOptions {
  bufferView?: number;
  byteOffset?: number;
  componentType: number;
  normalized?: boolean;
  count: number;
  type: string;
  max?: number[];
  min?: number[];
  sparse?: object;
}

export default class Accessor extends GltfObject {
  /**
   * The index of the bufferView
   * @private
   */
  #bufferView: BufferView;

  /**
   * The offset relative to the start of the bufferView in bytes
   * @private
   */
  #byteOffset: number;

  /**
   * The datatype of components in the attribute
   * TODO: Use enum
   * @private
   */
  #componentType: number;

  /**
   * Specifies whether integer data values should be normalized
   * @private
   */
  #normalized: boolean;

  /**
   * The number of attributes referenced by this accessor
   * @private
   */
  #count: number;

  /**
   * Specifies if the attribute is a scalar, vector, or matrix
   * // TODO: Enum
   * @private
   */
  #type: string;

  /**
   * Maximum value of each components in this attribute
   * @private
   */
  #max?: number[];

  /**
   * Minimum value of each components in this attribute
   * @private
   */
  #min?: number[];

  /**
   * Sparse storage of attributes that deviate from their initialization value
   * @private
   */
  #sparse?: object;

  public constructor(bufferView: BufferView, count: number, componentType: number, type: string, options?: AccessorOptions) {
    super(options);

    this.#bufferView = bufferView;
    this.#componentType = componentType;
    this.#count = count;
    this.#type = type;
    this.#byteOffset = options?.byteOffset ?? 0;
    this.#normalized = options?.normalized ?? false;
    this.#min = options?.min;
    this.#max = options?.max;
    this.#sparse = options?.sparse;
  }

  public static fromJson(json: AccessorJson, bufferViews: BufferView[]): Accessor {
    const bufferViewIndex = json.bufferView;
    if (bufferViewIndex === undefined || bufferViewIndex === null || bufferViewIndex < 0) {
      throw new Error("Undefined bufferView index not supported yet");
    }
    const bufferView = bufferViews[bufferViewIndex];
    const { count, type, componentType } = json;

    return new Accessor(bufferView, count, componentType, type, { ...json });
  }

  public static toJson(accessor: Accessor, format: Format, extensions?: GltfExtension[]): AccessorJson {
    throw new Error("Not yet implemented");
  }

  public static fromPositions(positions: number[], type: string): Accessor {
    const buffer = new Buffer(Float32Array.from(positions).buffer, positions.length * 4);
    const bufferView = new BufferView(buffer, buffer.byteLength, { target: 34962 });

    return new Accessor(bufferView, positions.length / Accessor.getAttributeTypeSize(type), 5126, type);
  }

  public static fromIndices(indices: number[]): Accessor {
    const buffer = new Buffer(Int16Array.from(indices).buffer, indices.length * 2);
    const bufferView = new BufferView(buffer, buffer.byteLength, { target: 34963 });

    return new Accessor(bufferView, indices.length, 5123, "SCALAR");
  }

  public getDataAsFloat32Array(): Float32Array {
    const arrayBuffer = this.#bufferView.getArrayBuffer(
      Accessor.getAttributeTypeSize(this.#type) * this.getComponentTypeByteSize(),
      this.getByteLength(),
      this.#byteOffset
    );
    return new Float32Array(arrayBuffer);
  }

  public getDataAsFloatArray(): number[] {
    return Array.from(this.getDataAsFloat32Array());
  }

  public getDataAsInt16Array(): Int16Array {
    const arrayBuffer = this.#bufferView.getArrayBuffer(
      Accessor.getAttributeTypeSize(this.#type) * this.getComponentTypeByteSize(),
      this.getByteLength(),
      this.#byteOffset
    );
    return new Int16Array(arrayBuffer);
  }

  public getDataAsInt32Array(): Int32Array {
    const arrayBuffer = this.#bufferView.getArrayBuffer(
      Accessor.getAttributeTypeSize(this.#type) * this.getComponentTypeByteSize(),
      this.getByteLength(),
      this.#byteOffset
    );
    return new Int32Array(arrayBuffer);
  }

  public getDataAsUint16Array(): Uint16Array {
    const arrayBuffer = this.#bufferView.getArrayBuffer(
      Accessor.getAttributeTypeSize(this.#type) * this.getComponentTypeByteSize(),
      this.getByteLength(),
      this.#byteOffset
    );
    return new Uint16Array(arrayBuffer);
  }

  public getDataAsUint32Array(): Uint16Array {
    const arrayBuffer = this.#bufferView.getArrayBuffer(
      Accessor.getAttributeTypeSize(this.#type) * this.getComponentTypeByteSize(),
      this.getByteLength(),
      this.#byteOffset
    );
    return new Uint16Array(arrayBuffer);
  }

  public getDataAsInt8Array(): Int8Array {
    const arrayBuffer = this.#bufferView.getArrayBuffer(
      Accessor.getAttributeTypeSize(this.#type) * this.getComponentTypeByteSize(),
      this.getByteLength(),
      this.#byteOffset
    );
    return new Int8Array(arrayBuffer);
  }

  public getDataAsIntArray(): number[] {
    return Array.from(this.getDataAsInt16Array());
  }

  public getData(): ArrayBuffer {
    return this.#bufferView.getArrayBuffer(
      Accessor.getAttributeTypeSize(this.#type) * this.getComponentTypeByteSize(),
      this.getByteLength(),
      this.#byteOffset
    );
  }

  /**
   * Get the accessor's byte length
   */
  public getByteLength(): number {
    return this.#count * this.getComponentByteSize();
  }

  /**
   * Get components size in bytes
   */
  public getComponentByteSize(): number {
    return this.getComponentTypeByteSize() * Accessor.getAttributeTypeSize(this.#type);
  }

  /**
   * Return components type size in bytes
   */
  public getComponentTypeByteSize(): number {
    switch (this.#componentType) {
      case 5120:
        return 1;
      case 5121:
        return 1;
      case 5122:
      case 5123:
        return 2;
      case 5125:
      case 5126:
        return 4;
      default: {
        throw new Error(`Accessor component type not found: ${this.#componentType}`);
      }
    }
  }

  // TODO: RENAME
  public static getAttributeTypeSize(type: string): number {
    switch (type) {
      case "SCALAR":
        return 1;
      case "VEC2":
        return 2;
      case "VEC3":
        return 3;
      case "VEC4":
        return 4;
      case "MAT2":
        return 4;
      case "MAT3":
        return 9;
      case "MAT4":
        return 16;
      default: {
        throw new Error("Accessor type not found: " + type);
      }
    }
  }

  public get target(): number {
    return this.#bufferView.target;
  }

  public set target(value: number) {
    this.#bufferView.target = value;
  }

  public get buffer(): Buffer {
    return this.#bufferView.buffer;
  }

  public set buffer(value: Buffer) {
    this.#bufferView.buffer = value;
  }

  public get bufferView(): BufferView {
    return this.#bufferView;
  }

  public get byteOffset(): number {
    return this.#byteOffset + this.#bufferView.byteOffset;
  }

  public get componentType(): number {
    return this.#componentType;
  }

  public get normalized(): boolean {
    return this.#normalized;
  }

  public set normalized(value: boolean) {
    this.#normalized = value;
  }

  public get count(): number {
    return this.#count;
  }

  public set count(value: number) {
    this.#count = value;
  }

  public get type(): string {
    return this.#type;
  }

  public set type(value: string) {
    this.#type = value;
  }

  public get max(): number[] | undefined {
    return this.#max;
  }

  public set max(value: number[] | undefined) {
    this.#max = value;
  }

  public get min(): number[] | undefined {
    return this.#min;
  }

  public set min(value: number[] | undefined) {
    this.#min = value;
  }

  public get sparse(): object | undefined {
    return this.#sparse;
  }

  public set sparse(value: object | undefined) {
    this.#sparse = value;
  }

  public set bufferView(value: BufferView) {
    this.#bufferView = value;
  }

  public set byteOffset(value: number) {
    this.#byteOffset = value;
  }

  public set componentType(value: number) {
    this.#componentType = value;
  }
}
