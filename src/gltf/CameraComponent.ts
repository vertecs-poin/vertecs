import { mat4 } from "gl-matrix";
import { Component, Entity } from "../ecs";
import GLTFExtension from "./GLTFExtension";
import { Transform } from "../math";

export default class CameraComponent extends Component {
  #projection: mat4;
  readonly #viewMatrix: mat4;
  readonly #type: string;
  #orthographic: any;
  #perspective: any;
  #name?: string;
  #extras?: any;

  // TODO: refactor
  public constructor(type: string, orthographic?: any, perspective?: any, name?: string, extras?: any) {
    super();
    this.#name = name;
    this.#viewMatrix = mat4.create();
    this.#type = type;
    this.#orthographic = orthographic;
    this.#perspective = perspective;
    this.#extras = extras;
    if (type === "perspective") {
      if (perspective) {
        this.#projection = mat4.perspective(
          mat4.create(),
          perspective.yfov, perspective.aspectRatio,
          perspective.zNear, perspective.zFar
        );
      } else {
        this.#projection = CameraComponent.createDefaultPerspectiveMatrix();
      }
    } else if (type === "orthographic") {
      if (orthographic) {
        this.#projection = mat4.ortho(
          mat4.create(),
          -orthographic.xmag, orthographic.xmag,
          -orthographic.ymag, orthographic.ymag,
          orthographic.zNear, orthographic.zFar
        );
      } else {
        this.#projection = CameraComponent.createDefaultOrthographicMatrix(960, 640);
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

  public static fromJSON(json: any): CameraComponent {
    return new CameraComponent(json.type, json.orthographic, json.perspective);
  }

  public static toJSON(node: Entity, extensions?: GLTFExtension[]): any {
    const cameraLens = node.getComponent(CameraComponent);

    // const extensions: any[] = [];
    // extensions?.forEach(extensionHandler => {
    //   const extension = extensionHandler.exportCameraLens(node, cameraLens);
    //   if (extension) {
    //     extensions.push(extension);
    //   }
    // });

    return {
      name: cameraLens.$name,
      type: cameraLens.$type,
      perspective: cameraLens.$perspective,
      orthographic: cameraLens.$orthographic,
      extensions: extensions,
      extras: cameraLens.$extras
    };
  }

  public getMvpMatrix(out: mat4, transform: Transform): mat4 {
    const viewModel = mat4.mul(out, this.#viewMatrix, transform.getModelToWorldMatrix());
    return mat4.mul(viewModel, this.projection, viewModel);
  }

  public getViewMatrix(transform: Transform): mat4 {
    const cameraTransform = transform.getModelToWorldMatrix();
    const copy = mat4.copy(this.#viewMatrix, cameraTransform);
    // TODO: ???
    copy[12] *= -1;
    copy[13] *= -1;
    copy[14] *= -1;
    return this.#viewMatrix;
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

  public get orthographic(): any {
    return this.#orthographic;
  }

  public set orthographic(value: any) {
    this.#orthographic = value;
  }

  public get perspective(): any {
    return this.#perspective;
  }

  public set perspective(value: any) {
    this.#perspective = value;
  }

  public get type(): string {
    return this.#type;
  }

  public get projection(): mat4 {
    return this.#projection;
  }

  public set projection(projection: mat4) {
    this.#projection = projection;
  }

  public clone(): Component {
    return this;
  }
}
