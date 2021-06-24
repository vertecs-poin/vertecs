import { vec3 } from "gl-matrix";
import LightSource from "./LightSource";
import { Entity } from "../../../ecs";

export default class AmbientLight extends LightSource {
	public static readonly BYTE_SIZE = 16;

	public constructor(color?: vec3) {
		super(color);
	}

	public update(entity: Entity): void {

	}

  public get data(): ArrayBuffer {
    return new Float32Array([...this.color, this.intensity]);
  }
}
