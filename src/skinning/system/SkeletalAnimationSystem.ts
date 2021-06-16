import { Entity, System } from "../../ecs";
import { Joint } from "../component/Joint";
import { Transform } from "../../math";

/**
 *
 */
export class SkeletalAnimationSystem extends System<[Joint, Transform]> {

  public constructor(tps?: number) {
    super([Joint, Transform], tps);
  }

  public async initialize(): Promise<void> {

  }

  protected onEligible(entity: Entity) {
  }

  public onUpdate(entities: [Joint, Transform][]): void {
    entities.forEach(([joint, jointTransform]) => {
      joint.updateJointMatrix(jointTransform.getModelToWorldMatrix());
    });
  }
}
