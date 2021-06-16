import Entity from "../ecs/Entity";
import Accessor from "./Accessor";
import GltfExtension from "./GltfExtension";
import Material from "./Material";
import Primitive, { PrimitiveJson } from "./Primitive";
import Component from "../ecs/Component";
import { GltfOptions } from "./GltfFactory";

export type MeshOptions = {
  name?: string;
  extras?: any;
  object?: any;
}

export interface MeshJson extends GltfOptions {
  primitives: PrimitiveJson[]
}

export default class Mesh extends Component {
  #primitives: Primitive[];
  #name?: string;

  public constructor(primitives: Primitive[], options?: MeshOptions) {
    super();
    this.#primitives = primitives;
    this.#name = options?.name;
  }

  public static fromJson(meshJson: MeshJson, accessors: Accessor[], materials?: Material[]): Mesh {
    const primitives = meshJson.primitives.map(primitiveJson => Primitive.fromJson(primitiveJson, accessors, materials));
    return new Mesh(primitives, { name: meshJson.name });
  }

  /**
   * Export a mesh to a JSON format
   * @param mesh The mesh entity
   * @param primitives TODO:
   * @param extensions The extensions used for exporting
   */
  public static toJson(mesh: Entity, primitives: PrimitiveJson[], extensions?: GltfExtension[]): MeshJson {
    return {
      primitives: primitives,
      name: mesh.name,
      extensions: extensions?.map((extension) => extension.exportMesh(mesh)),
      extras: undefined
    };
  }

  public get name(): string | undefined {
    return this.#name;
  }

  public set name(value: string | undefined) {
    this.#name = value;
  }

  public get primitives(): Primitive[] {
    return this.#primitives;
  }

  public set primitives(value: Primitive[]) {
    this.#primitives = value;
  }
}
