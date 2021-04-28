// import { vec3 } from "gl-matrix";
//
// export abstract class Light extends Serializable {
// 	protected color: vec3;
// 	protected intensity: number;
// 	protected dirty: boolean;
//
// 	protected constructor(color?: vec3, intensity?: number) {
// 		super();
// 		this.color = color ?? vec3.create();
// 		this.intensity = intensity ?? 1;
// 		this.dirty = false;
// 	}
//
// 	public deserialize(entity: Entity, data: any): void {
// 		let color = data.color.split(",");
// 		vec3.set(this.color, Number.parseFloat(color[0]), Number.parseFloat(color[1]), Number.parseFloat(color[2]));
// 		this.intensity = data.intensity;
// 		this.dirty = false;
// 	}
//
// 	public serialize(entity: Entity): any {
// 		return {
// 			color: this.color.toString(),
// 			intensity: this.intensity
// 		};
// 	}
//
// 	public validate(entity: Entity, data: any): boolean {
// 		return false;
// 	}
//
// 	public isDirty(entity: Entity): boolean {
// 		return this.dirty;
// 	}
//
// 	public abstract update(entity: Entity): void;
//
// 	public abstract getData(): Float32Array;
//
// 	public get $color(): vec3 {
// 		return this.color;
// 	}
//
// 	public set $color(value: vec3) {
// 		vec3.copy(this.color, value);
// 		this.dirty = true;
// 	}
//
// 	public get $intensity(): number {
// 		return this.intensity;
// 	}
//
// 	public set $intensity(value: number) {
// 		this.intensity = value;
// 		this.dirty = true;
// 	}
//
// 	public clone(): Component {
// 		return this;
// 	}
// }
