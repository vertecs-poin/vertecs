import { mat4, quat, vec3 } from "gl-matrix";
import { Entity } from "../../../ecs";
import { Transform } from "../../../math";
import LightSource from "./LightSource";

export default class DirectionalLight extends LightSource {
  public static readonly BYTE_SIZE = 48;

  readonly #rotationCameraSpace: quat;
  readonly #directionCameraSpace: vec3;
  #range: number;

  readonly #data: ArrayBuffer;

  public constructor(color?: vec3, intensity = 1, range = -1) {
    super(color, intensity);
    this.#data = new ArrayBuffer(DirectionalLight.BYTE_SIZE);
    this.#rotationCameraSpace = quat.create();
    this.#directionCameraSpace = vec3.create();
    this.#range = range;
  }

  public update(entity: Entity) {
    const modelToWorldMatrix = entity.getComponent(Transform)!.getModelToWorldMatrix();
    const rotation = mat4.getRotation(quat.create(), modelToWorldMatrix);
    const direction = vec3.transformQuat(vec3.create(), [0, 0, 1], rotation);

    new Float32Array(this.#data).set([...this.color, this.intensity, ...direction, this.#range], 0);
  }

  public serialize(entity: Entity): any {
    const lightData = super.serialize(entity);
    lightData.range = this.#range;
    return lightData;
  }

  public deserialize(entity: Entity, data: any) {
    super.deserialize(entity, data);
    this.#range = data.range;
  }

  public get data(): ArrayBuffer {
    return this.#data;
  }

  public get range(): number {
    return this.#range;
  }

  public set range(value: number) {
    this.#range = value;
    this.$dirty = true;
  }
}
