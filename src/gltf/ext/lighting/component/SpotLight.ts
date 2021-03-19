// import { vec3 } from "gl-matrix";
// import { Entity } from "../../ecs";
// import { Light } from "./Light";
//
// export class SpotLight extends Light {
// 	private innerConeAngle: number;
// 	private outerConeAngle: number;
//
// 	public constructor(color?: vec3, innerConeAngle?: number, outerConeAngle?: number) {
// 		super(color);
// 		this.innerConeAngle = innerConeAngle ?? 1;
// 		this.outerConeAngle = outerConeAngle ?? 4;
// 	}
//
// 	public serialize(entity: Entity): any {
// 		const lightData = super.serialize(entity);
// 		lightData.innerConeAngle = this.innerConeAngle;
// 		lightData.outerConeAngle = this.outerConeAngle;
// 		return lightData;
// 	}
//
// 	public deserialize(entity: Entity, data: any) {
// 		super.deserialize(entity, data);
// 		this.innerConeAngle = data.innerConeAngle;
// 		this.outerConeAngle = data.outerConeAngle;
// 	}
//
// 	public update(entity: Entity): void {
//
// 	}
//
// 	public getData(): Float32Array {
// 		return this.color as Float32Array;
// 	}
//
// 	public get $innerConeAngle(): number {
// 		return this.innerConeAngle;
// 	}
//
// 	public set $innerConeAngle(value: number) {
// 		this.innerConeAngle = value;
// 		this.dirty = true;
// 	}
//
// 	public get $outerConeAngle(): number {
// 		return this.outerConeAngle;
// 	}
//
// 	public set $outerConeAngle(value: number) {
// 		this.outerConeAngle = value;
// 		this.dirty = true;
// 	}
// }
