// import { mat4, quat, vec3 } from "gl-matrix";
// import { Entity } from "../../ecs";
// import { Transform } from "../../gltf";
// import { Light } from "./Light";
//
// export class DirectionalLight extends Light {
// 	public static readonly BIT_SIZE = 32;
// 	private readonly rotationCameraSpace: quat;
// 	private readonly directionCameraSpace: vec3;
// 	private readonly data: Float32Array;
// 	private range: number;
//
// 	public constructor(color?: vec3, intensity = 1, range = -1) {
// 		super(color, intensity);
// 		this.data = new Float32Array(DirectionalLight.BIT_SIZE);
// 		this.rotationCameraSpace = quat.create();
// 		this.directionCameraSpace = vec3.create();
// 		this.range = range;
// 	}
//
// 	public update(entity: Entity) {
// 		const modelToWorldMatrix = entity.getComponent(Transform)
// 		.getModelToWorldMatrix(entity);
// 		const rotation = mat4.getRotation(quat.create(), modelToWorldMatrix);
// 		const direction = vec3.transformQuat(vec3.create(), [0, 0, 1], rotation);
//
// 		this.data.set([...this.color, this.intensity, ...direction, this.range], 0);
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
