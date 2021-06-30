import { mat4, quat, vec3 } from "gl-matrix";
import { Component, Entity } from "../ecs";
import GltfExtension from "./GltfExtension";
import { Transform } from "../math";
import { GltfOptions } from "./GltfFactory";

export interface CameraJson extends GltfOptions {
  type: string;
  perspective?: {
    aspectRatio: number;
    yfov: number;
    zfar: number;
    znear: number;
  }
  orthographic?: {}
}

export default class CameraComponent extends Component {
  #projectionMatrix: mat4;
  readonly #viewMatrix: mat4;
  readonly #type: string;
  #name?: string;
  #extras?: any;
  #lookAt: vec3;

  public constructor(type: string, orthographic?: any, perspective?: any, name?: string, extras?: any) {
    super();
    this.#name = name;
    this.#viewMatrix = mat4.create();
    this.#type = type;
    this.#extras = extras;
    this.#lookAt = vec3.fromValues(0, 0, 0);
    if (type === "perspective") {
      if (perspective) {
        this.#projectionMatrix = mat4.perspective(
          mat4.create(),
          perspective.yfov, perspective.aspectRatio,
          perspective.znear, perspective.zfar
        );
      } else {
        this.#projectionMatrix = CameraComponent.createDefaultPerspectiveMatrix();
      }
    } else if (type === "orthographic") {
      if (orthographic) {
        this.#projectionMatrix = mat4.ortho(
          mat4.create(),
          -orthographic.xmag, orthographic.xmag,
          -orthographic.ymag, orthographic.ymag,
          orthographic.znear, orthographic.zfar
        );
      } else {
        this.#projectionMatrix = CameraComponent.createDefaultOrthographicMatrix(960, 640);
      }
    } else {
      throw new Error("Projection type error, value: " + type + " not allowed.");
    }
  }

  private static createDefaultPerspectiveMatrix(): mat4 {
    return mat4.perspective(mat4.create(), 80 * Math.PI / 180, 16 / 9.0, .01, -100);
  }

  private static createDefaultOrthographicMatrix(width: number, height: number): mat4 {
    return mat4.ortho(mat4.create(), -width, width, -height, height, .1, -100);
  }

  public static fromJson(json: CameraJson): CameraComponent {
    return new CameraComponent(json.type, json.orthographic, json.perspective);
  }

  public static toJson(node: Entity, extensions?: GltfExtension[]): CameraJson {
    throw new Error("Not yet implemented");
  }

  public getMvpMatrix(out: mat4, transform: Transform): mat4 {
    const viewModel = mat4.mul(out, this.#viewMatrix, transform.getModelToWorldMatrix());
    return mat4.mul(viewModel, this.projection, viewModel);
  }

  public getViewMatrix(transform: Transform): mat4 {
    const parent = transform.parent;
    const cameraPosition = transform.getWorldTranslation(vec3.create());
    vec3.transformQuat(cameraPosition, cameraPosition, transform.rotation);

    // Make camera look at parent entity
    if (parent) {
      this.lookAt = parent.getWorldTranslation(vec3.create());
    }

    mat4.lookAt(this.#viewMatrix, cameraPosition, this.#lookAt, [0, 1, 0]);
    return this.#viewMatrix;
  }

  public set lookAt(lookAt: vec3) {
    vec3.copy(this.#lookAt, lookAt);
  }

  public get extras(): any {
    return this.#extras;
  }

  public set extras(value: any) {
    this.#extras = value;
  }

  public get name(): string | undefined {
    return this.#name;
  }

  public set name(value: string | undefined) {
    this.#name = value;
  }

  public get type(): string {
    return this.#type;
  }

  public get projection(): mat4 {
    return this.#projectionMatrix;
  }

  public set projection(projection: mat4) {
    this.#projectionMatrix = projection;
  }

  public clone(): Component {
    return this;
  }
}
