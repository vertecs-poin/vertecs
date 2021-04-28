import BufferView from "./BufferView";
import GLTFObject from "./GLTFObject";
import GLTFExtension from "./GLTFExtension";
import { Format, GLTFOptions } from "./GLTFFactory";
import Buffer from "./Buffer";
import TypedArray = NodeJS.TypedArray;

interface AccessorOptions extends GLTFOptions {
  byteOffset?: number;
  normalized?: boolean;
  min?: number[];
  max?: number[];
  sparse?: object;
}

export default class Accessor extends GLTFObject {
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
   * @private
   */
  #type: string;

  /**
   * Maximum value of each component in this attribute
   * @private
   */
  #max?: number[];

  /**
   * Minimum value of each component in this attribute
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

  public static fromJson(json: any, bufferViews: BufferView[]): Accessor {
    const bufferView = bufferViews[json.bufferView];
    const { count, type, componentType } = json;

    return new Accessor(bufferView, count, componentType, type, { ...json });
  }

  public static toJSON(accessor: Accessor, format: Format, extensions?: GLTFExtension[]): any {
    return {
      name: accessor.name,
      bufferView: BufferView.toJSON(accessor.#bufferView, format),
      byteOffset: accessor.byteOffset,
      componentType: accessor.componentType,
      normalized: accessor.normalized,
      count: accessor.count,
      type: accessor.type,
      min: accessor.min,
      max: accessor.max,
      sparse: accessor.sparse,
      extensions: extensions?.map((extension) => extension.exportAccessor(accessor)),
      extras: accessor.extras
    };
  }

  public getDataAsFloat32Array(): Float32Array {
    const arrayBuffer = this.#bufferView.getArrayBuffer(
      this.getComponentTypeSize() * this.getComponentTypeSizeInBytes(),
      this.getByteLength(),
      this.#byteOffset
    );
    return new Float32Array(
      arrayBuffer
    );
  }

  public getDataAsFloatArray(): number[] {
    return Array.from(this.getDataAsFloat32Array());
  }

  public getDataAsInt16Array(): Int16Array {
    const resultView = new Int16Array(this.getByteLength() / 2);
    const dataView = new Int16Array(this.#bufferView.getArrayBuffer(this.getComponentTypeSize() * this.getComponentTypeSizeInBytes()));

    if (this.bufferView.byteStride) {
      let sourceIndex = 0;
      let destinationIndex = 0;
      const elementCount = this.count;
      const step = this.bufferView.byteStride;
      for (let elementIndex = 0; elementIndex < elementCount; elementIndex++) {
        sourceIndex = this.byteOffset + elementIndex * step;
        destinationIndex = elementIndex * step;
        resultView.set(dataView.slice(sourceIndex, sourceIndex + step), destinationIndex);
      }
    } else {
      resultView.set(dataView.slice((this.byteOffset / 2), (this.byteOffset / 2) + this.getByteLength()), 0);
    }

    return resultView;
  }

  public getDataAsInt8Array(): Int8Array {
    const result = new ArrayBuffer(this.getByteLength());
    const resultView = new Int8Array(result);

    const dataView = new Int8Array(this.#bufferView.getData());

    if (this.bufferView.byteStride) {
      let sourceIndex = 0;
      let destinationIndex = 0;
      const elementCount = this.count;
      const step = this.bufferView.byteStride;
      for (let elementIndex = 0; elementIndex < elementCount; elementIndex++) {
        sourceIndex = this.byteOffset + elementIndex * step;
        destinationIndex = elementIndex * step;
        for (let i = 0; i < step; i++) {
          resultView.set(dataView.slice(sourceIndex, sourceIndex + step), destinationIndex);
        }
      }
    } else {
      resultView.set(dataView.slice(this.byteOffset, this.byteOffset + this.getByteLength()), 0);
    }

    return resultView;
  }

  public getDataAsIntArray(): number[] {
    return Array.from(this.getDataAsInt16Array());
  }

  /**
   * Get the accessor's byte length
   */
  public getByteLength(): number {
    return this.#count * this.getComponentTypeSizeInBytes() * this.getComponentTypeSize();
  }

  // TODO: RENAME
  public getComponentTypeSizeInBytes(): number {
    switch (this.#componentType) {
      case 5120: {
        return 1;
      }
      case 5121: {
        return 1;
      }
      case 5122:
      case 5123: {
        return 2;
      }
      case 5125:
      case 5126: {
        return 4;
      }
      default: {
        throw new Error(`Accessor component type not found: ${this.#componentType}`);
      }
    }
  }

  // TODO: RENAME
  public getComponentTypeSize(): number {
    switch (this.#type) {
      case "SCALAR": {
        return 1;
      }
      case "VEC2": {
        return 2;
      }
      case "VEC3": {
        return 3;
      }
      case "VEC4" || "MAT2": {
        return 4;
      }
      case "MAT3": {
        return 9;
      }
      case "MAT4": {
        return 16;
      }
      default: {
        throw new Error("Accessor type not found");
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

  public get count(): number {
    return this.#count;
  }

  public get type(): string {
    return this.#type;
  }

  public get max(): number[] | undefined {
    return this.#max;
  }

  public get min(): number[] | undefined {
    return this.#min;
  }

  public get sparse(): object | undefined {
    return this.#sparse;
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

  public set normalized(value: boolean) {
    this.#normalized = value;
  }

  public set count(value: number) {
    this.#count = value;
  }

  public set type(value: string) {
    this.#type = value;
  }

  public set max(value: number[] | undefined) {
    this.#max = value;
  }

  public set min(value: number[] | undefined) {
    this.#min = value;
  }

  public set sparse(value: object | undefined) {
    this.#sparse = value;
  }
}
