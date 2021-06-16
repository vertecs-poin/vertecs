// import Entity from "@ecs/Entity";
// import System from "@ecs/System";
// import { Light } from "../components/Light";
// import { LightScene } from "./LightScene";
//
// export class LightingSystem extends System {
// 	private lightScene: LightScene | undefined;
//
// 	public constructor(tps?: number) {
// 		super([Light], tps);
// 	}
//
// 	public init(): void {
// 		this.lightScene = new LightScene();
// 		this.lightScene.updateLightCount();
// 	}
//
// 	public onEntityEligible(entity: Entity) {
// 		this.lightScene!.addLight(entity.getComponent(Light));
// 	}
//
// 	public update(entities: Entity[]): void {
// 		entities.forEach((entity) => {
// 			const light = entity.getComponent(Light);
// 			light.update(entity);
// 			this.lightScene!.updateLight(light);
// 		});
// 	}
// }
