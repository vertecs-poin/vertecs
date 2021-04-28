import Entity from "../ecs/Entity";
import Accessor from "./Accessor";
import GLTFExtension from "./GLTFExtension";
import Material from "./Material";
import Primitive from "./Primitive";
import { Component } from "../ecs";

export default class Mesh extends Component {
  #primitives: Primitive[];

  public constructor(primitives: Primitive[]) {
    super();
    this.#primitives = primitives;
  }

  public static fromJson(json: any, accessors: Accessor[], materials: Material[]): Mesh {
    const primitives = json.primitives.map((json: any) => Primitive.fromJSON(json, accessors, materials));
    return new Mesh(primitives);
  }

  /**
   * Export a mesh to a JSON format
   * @param mesh The mesh entity
   * @param primitives TODO:
   * @param extensions The extensions used for exporting
   */
  public static toJSON(mesh: Entity, primitives: any[], extensions?: GLTFExtension[]): any {
    return {
      name: mesh.name,
      extensions: extensions?.map((extension) => extension.exportMesh(mesh)),
      extras: undefined
    };
  }

  public get primitives(): Primitive[] {
    return this.#primitives;
  }

  public set primitives(value: Primitive[]) {
    this.#primitives = value;
  }
}
