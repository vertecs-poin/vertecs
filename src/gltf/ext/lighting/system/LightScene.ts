// import { AmbientLight } from "../components/AmbientLight";
// import { DirectionalLight } from "../components/DirectionalLight";
// import { Light } from "../components/Light";
// import { PointLight } from "../components/PointLight";
//
// export class LightScene extends UniformBufferObject {
// 	public static readonly MAX_AMBIENT_LIGHTS = 2;
// 	public static readonly MAX_POINT_LIGHTS = 8;
// 	public static readonly MAX_DIRECTIONAL_LIGHTS = 8;
//
// 	public static readonly AMBIENT_LIGHTS_OFFSET = 16;
//
// 	public static readonly POINT_LIGHTS_OFFSET =
// 		LightScene.AMBIENT_LIGHTS_OFFSET + LightScene.MAX_AMBIENT_LIGHTS * AmbientLight.BIT_SIZE;
//
// 	public static readonly DIRECTIONAL_LIGHTS_OFFSET =
// 		LightScene.POINT_LIGHTS_OFFSET + LightScene.MAX_POINT_LIGHTS * PointLight.BIT_SIZE;
//
// 	public static readonly MAX_SIZE = 16 +
// 		LightScene.MAX_AMBIENT_LIGHTS * AmbientLight.BIT_SIZE +
// 		LightScene.MAX_POINT_LIGHTS * PointLight.BIT_SIZE +
// 		LightScene.MAX_DIRECTIONAL_LIGHTS * DirectionalLight.BIT_SIZE;
//
// 	private ambientLights: AmbientLight[];
// 	private pointLights: PointLight[];
// 	private directionalLights: DirectionalLight[];
//
// 	public constructor() {
// 		super(1, LightScene.MAX_SIZE, BufferUsage.Vertex, false);
// 		this.ambientLights = [];
// 		this.pointLights = [];
// 		this.directionalLights = [];
// 		this.updateLightCount();
// 	}
//
// 	public addLight(light: Light) {
// 		if (light instanceof AmbientLight) {
// 			this.ambientLights.push(light);
// 		} else if (light instanceof PointLight) {
// 			this.pointLights.push(light);
// 		} else if (light instanceof DirectionalLight) {
// 			this.directionalLights.push(light);
// 		}
// 		this.updateLightCount();
// 		this.updateLight(light);
// 	}
//
// 	public updateLightCount() {
// 		super.updateFromBufferSource(new Int32Array(
// 			[this.ambientLights.length, this.pointLights.length, this.directionalLights.length, 0]
// 		));
// 	}
//
// 	public updateLight(light: Light): void {
// 		let offset;
// 		if (light instanceof AmbientLight) {
// 			const index = this.ambientLights.indexOf(light);
// 			if (index !== undefined) offset = LightScene.AMBIENT_LIGHTS_OFFSET + index * AmbientLight.BIT_SIZE;
// 		} else if (light instanceof PointLight) {
// 			const index = this.pointLights.indexOf(light);
// 			if (index !== undefined) offset = LightScene.POINT_LIGHTS_OFFSET + index * PointLight.BIT_SIZE;
// 		} else if (light instanceof DirectionalLight) {
// 			const index = this.directionalLights.indexOf(light);
// 			if (index !== undefined) offset = LightScene.DIRECTIONAL_LIGHTS_OFFSET + index * DirectionalLight.BIT_SIZE;
// 		}
// 		if (offset !== undefined) {
// 			super.updateFromBufferSource(light.getData());
// 		}
// 	}
//
// 	public update(entity: Entity): void {
// 	}
//
// 	public getDescriptor(): any { }
// }
