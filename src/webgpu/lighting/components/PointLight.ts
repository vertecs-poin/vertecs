import { vec3 } from "gl-matrix";
import LightSource from "./LightSource";
import { Entity } from "../../../ecs";
import { Transform } from "../../../math";

export default class PointLight extends LightSource {
  public static readonly BYTE_SIZE = 32;

  readonly #currentPositionCameraSpace: vec3;
  #range: number;

  readonly #lastPositionCameraSpace: vec3;

  readonly #data: ArrayBuffer;

  public constructor(color?: vec3, intensity = 1, range = -1) {
    super(color || vec3.fromValues(1, 1, 1), intensity);
    this.#range = range;
    this.#data = new ArrayBuffer(PointLight.BYTE_SIZE);
    this.#lastPositionCameraSpace = vec3.fromValues(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    this.#currentPositionCameraSpace = vec3.create();
  }

  public update(transform: Transform): void {
    vec3.copy(this.#lastPositionCameraSpace, this.#currentPositionCameraSpace);
    transform.getWorldPosition(this.#currentPositionCameraSpace);
    if (!vec3.equals(this.#lastPositionCameraSpace, this.#currentPositionCameraSpace)) {
      new Float32Array(this.#data).set([...this.$color, this.$intensity, ...this.#currentPositionCameraSpace, this.#range]);
    }
  }

  // TODO: json export type
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
