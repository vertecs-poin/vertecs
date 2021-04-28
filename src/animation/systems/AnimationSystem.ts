import { System } from "../../ecs";
import AnimationComponent from "../components/AnimationComponent";
import { Transform } from "../../math";

/**
 * GLTF based animation system
 */
export default class AnimationSystem extends System<[Transform, AnimationComponent]> {

  public constructor(tps?: number) {
    super([Transform, AnimationComponent], tps);
  }

  public async initialize(): Promise<void> {

  }

  public onUpdate(timePassed: number): void {
    this.$entities.forEach(([transform, animationComponent]) => {
      animationComponent.update(transform, timePassed / 1000);
    });
  }
}
