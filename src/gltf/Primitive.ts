import Accessor from "./Accessor";
import Buffer from "./Buffer";
import BufferView from "./BufferView";
import { GLTFOptions } from "./GLTFFactory";
import GLTFExtension from "./GLTFExtension";
import Material from "./Material";

interface PrimitiveOptions extends GLTFOptions {
  attributes: Map<string, Accessor>,
  indices?: Accessor,
  mode?: number,
  material?: Material
}

export default class Primitive {
  #attributes: Map<string, Accessor>;

  #indices?: Accessor;

  #material: Material;

  /**
   * The type of primitives to render
   * @see https://github.com/KhronosGroup/glTF/tree/master/specification/2.0/#primitivemode
   * @private
   */
  #mode: number;

  public constructor(options: PrimitiveOptions) {
    this.#attributes = options.attributes;
    this.#indices = options.indices;
    this.#mode = options?.mode ?? 4;
    this.#material = options?.material ?? new Material();
  }

  public static fromJSON(json: any, accessors: Accessor[], materials: Material[]): Primitive {
    const jsonAttributes: Map<string, number> = new Map(Object.entries(json.attributes));
    const attributes = new Map<string, Accessor>();

    jsonAttributes.forEach((value, key) => {
      attributes.set(key, accessors[value]);
    });

    return new Primitive({
      attributes,
      indices: accessors[json.indices],
      mode: json.mode,
      extensions: json.extensions,
      extras: json.extras,
      name: json.name,
      material: materials[json.material]
    });
  }

  public static toJSON(primitive: Primitive, extensions: GLTFExtension) {
    return {};
  }

  public static fromGeometry(vertices: number[], indices?: number[], normals?: number[], texCoords?: number[], min = [-1,
    -1,
    -1], max = [1,
    1,
    1]): Primitive {
    const attributes = new Map<string, Accessor>();
    if (vertices) {
      const data = new ArrayBuffer(vertices.length * 4);
      new Float32Array(data).set(vertices);
      const buffer = new Buffer(data, data.byteLength);
      const bufferView = new BufferView(buffer, data.byteLength);
      const accessor = new Accessor(bufferView, vertices.length / 3, WebGL2RenderingContext.FLOAT, "VEC3", {
        min,
        max
      });
      attributes.set("POSITION", accessor);
    }

    let indicesAccessor;
    if (indices) {
      const data = new ArrayBuffer(indices.length * 4);
      new Uint32Array(data).set(indices);
      const buffer = new Buffer(data, data.byteLength);
      const bufferView = new BufferView(buffer, data.byteLength);
      indicesAccessor = new Accessor(bufferView, indices.length, WebGL2RenderingContext.UNSIGNED_INT, "SCALAR");
    } else {
      indicesAccessor = undefined;
    }

    if (texCoords) {
      const data = new ArrayBuffer(texCoords.length * 4);
      new Float32Array(data).set(texCoords);
      const buffer = new Buffer(data, data.byteLength);
      const bufferView = new BufferView(buffer, data.byteLength);
      const accessor = new Accessor(
        bufferView,
        texCoords.length / 2,
        WebGL2RenderingContext.FLOAT, "VEC2",
        { max: [1, 1], min: [-1, -1] }
      );
      attributes.set("TEXCOORD_0", accessor);
    }

    return new Primitive({
      attributes,
      mode: 4,
      indices: indicesAccessor
    });
  }

  /**
   * Returns the number of index to draw
   */
  public getIndexCount(): number {
    if (this.#indices) {
      return this.#indices.count;
    }
    const positionAttribute = this.#attributes.get("POSITION") || this.#attributes.get("XZ");
    if (positionAttribute) {
      return positionAttribute.count;
    }
    throw new Error(`Could not find index count for primitive :${this}`);
  }

  public get material(): Material {
    return this.#material;
  }

  public set material(value: Material) {
    this.#material = value;
  }

  public get attributes(): Map<string, Accessor> {
    return this.#attributes;
  }

  public get indices(): Accessor | undefined {
    return this.#indices;
  }

  public get mode(): number {
    return this.#mode;
  }

  public set attributes(value: Map<string, Accessor>) {
    this.#attributes = value;
  }

  public set indices(value: Accessor | undefined) {
    this.#indices = value;
  }

  public set mode(value: number) {
    this.#mode = value;
  }
}
