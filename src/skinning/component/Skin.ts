import { mat4 } from "gl-matrix";
import Component from "../../ecs/Component";
import { Skeleton } from "./Skeleton";

export class Skin extends Component {
  #skeleton: Skeleton;
  #matrices: mat4[];
  #name?: string;
  #extensions?: object;
  #extras?: any;

  public constructor(skeleton: Skeleton, name?: string, extensions?: object, extras?: any) {
    super();

    this.#name = name;
    this.#extensions = extensions;
    this.#extras = extras;

    this.#skeleton = skeleton;
    this.#matrices = [];
  }

  public get skeleton(): Skeleton {
    return this.#skeleton;
  }

  public set skeleton(value: Skeleton) {
    this.#skeleton = value;
  }

  public get matrices(): mat4[] {
    return this.#matrices;
  }

  public set matrices(value: mat4[]) {
    this.#matrices = value;
  }

  public clone(): Component {
    throw new Error("Not yet implemented");
  }
}
