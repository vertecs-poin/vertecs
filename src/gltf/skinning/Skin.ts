import { mat4 } from 'gl-matrix';
import Accessor from '../Accessor';
import Joint from './Joint';
import Skeleton from './Skeleton';
import { Component, Entity } from "../../ecs";
import { GLTFOptions } from "../Gltf";

export default class Skin extends Component {
  #name?: string;

  #extensions?: object;

  #extras?: any;

  #skeleton: Skeleton;

  #joints: Joint[];

  #matrices: mat4[];

  public constructor(joints: Joint[], skeleton: Skeleton, options?: GLTFOptions) {
    super();

    this.#name = options?.name;
    this.#extensions = options?.extensions;
    this.#extras = options?.extras;

    this.#skeleton = skeleton;
    this.#joints = joints;
    this.#matrices = [];
    this.#joints.forEach(() => this.#matrices.push(mat4.create()));
  }

  public static fromJson(skin: any, accessor: Accessor, nodes: Entity[]): Skin {
    const inverseBindMatrices = accessor.getData();

    const joints: Joint[] = [];
    skin.joints.forEach((joint: any, i: number) => {
      const jointComponent = new Joint(this.createMatrixFromArray(new Float32Array(inverseBindMatrices).slice(i * 16), i * 16 + 16));
      nodes[joint].addComponent(jointComponent);
      joints.push(jointComponent);
    });

    return new Skin(joints, new Skeleton());
  }

  private static createMatrixFromArray(buffer: Float32Array, start: number): mat4 {
    const matrix = mat4.create();
    mat4.copy(matrix, buffer);
    return matrix;
  }

  public get $skeleton(): Skeleton {
    return this.skeleton;
  }

  public set skeleton(value: Skeleton) {
    this.#skeleton = value;
  }

  public get current(): mat4[] {
    return this.#matrices;
  }

  public set current(value: mat4[]) {
    this.#matrices = value;
  }

  public get joints(): Joint[] {
    return this.#joints;
  }

  public set joints(value: Joint[]) {
    this.#joints = value;
  }

  public clone(): Component {
    return new Skin(this.#joints, this.#skeleton);
  }
}
