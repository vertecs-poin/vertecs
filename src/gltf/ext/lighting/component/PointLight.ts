// import { vec3 } from "gl-matrix";
// import { Light } from "./Light";
// import { Entity } from "../../ecs";
// import { Transform } from "../../gltf";
//
// export class PointLight extends Light {
// 	public static readonly BIT_SIZE = 32;
//
// 	private range: number;
// 	private readonly lastPositionCameraSpace: vec3;
// 	private readonly currentPositionCameraSpace: vec3;
//
// 	private readonly data: Float32Array;
//
// 	public constructor(color?: vec3, intensity = 1, range = -1) {
// 		super(color || vec3.fromValues(1, 1, 1), intensity);
// 		this.range = range;
// 		this.data = new Float32Array(PointLight.BIT_SIZE);
// 		this.lastPositionCameraSpace = vec3.create();
// 		this.currentPositionCameraSpace = vec3.create();
// 	}
//
// 	public update(entity: Entity) {
// 		vec3.copy(this.lastPositionCameraSpace, this.currentPositionCameraSpace);
// 		entity.getComponent(Transform)
// 		.getWorldPosition(this.currentPositionCameraSpace, entity);
// 		if (!vec3.equals(this.lastPositionCameraSpace, this.currentPositionCameraSpace)) {
// 			this.data.set([...this.color, this.intensity, ...this.currentPositionCameraSpace,
// 				this.range], 0);
// 		}
// 	}
//
// 	public serialize(entity: Entity): any {
// 		const lightData = super.serialize(entity);
// 		lightData.range = this.range;
// 		return lightData;
// 	}
//
// 	public deserialize(entity: Entity, data: any) {
// 		super.deserialize(entity, data);
// 		this.range = data.range;
// 	}
//
// 	public getData(): Float32Array {
// 		return this.data;
// 	}
//
// 	public get $range(): number {
// 		return this.range;
// 	}
//
// 	public set $range(value: number) {
// 		this.range = value;
// 		this.dirty = true;
// 	}
// }
