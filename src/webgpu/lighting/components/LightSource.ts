import { Component, Entity } from "../../../ecs";
import { vec3 } from "gl-matrix";

/**
 * TODO: LightSource + LightSourceView
 * TODO: Add serializable
 */
export default abstract class LightSource extends Component {
  protected $color: vec3;
  protected $intensity: number;
  protected $dirty: boolean;

  protected constructor(color?: vec3, intensity?: number) {
    super();
    this.$color = color ?? vec3.create();
    this.$intensity = intensity ?? 1;
    this.$dirty = false;
  }

  public abstract get data(): ArrayBuffer;

  public deserialize(entity: Entity, data: any): void {
    const color = data.color.split(",");
    vec3.set(this.$color, Number.parseFloat(color[0]), Number.parseFloat(color[1]), Number.parseFloat(color[2]));
    this.$intensity = data.intensity;
    this.$dirty = false;
  }

  public serialize(entity: Entity): any {
    return {
      color: this.$color.toString(),
      intensity: this.$intensity
    };
  }

  public validate(entity: Entity, data: any): boolean {
    return false;
  }

  public isDirty(entity: Entity): boolean {
    return this.$dirty;
  }

  public get color(): vec3 {
    return this.$color;
  }

  public set color(value: vec3) {
    vec3.copy(this.$color, value);
    this.$dirty = true;
  }

  public get intensity(): number {
    return this.$intensity;
  }

  public set intensity(value: number) {
    this.$intensity = value;
    this.$dirty = true;
  }

  public clone(): Component {
    return this;
  }
}
