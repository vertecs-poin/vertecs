import Sampler from './Sampler';
import ChannelTarget from './ChannelTarget';
import Entity from '../../ecs/Entity';

export default class AnimationChannel {
  private animationSampler: Sampler;

  private target: ChannelTarget;

  public constructor(animationSampler: Sampler, target: ChannelTarget) {
    this.animationSampler = animationSampler;
    this.target = target;
  }

  public static fromJson(json: any, samplers: Sampler[], nodes: Entity[]): AnimationChannel {
    return new AnimationChannel(
      samplers[json.sampler],
      ChannelTarget.fromJson(json.target, nodes),
    );
  }

  public get $animationSampler(): Sampler {
    return this.animationSampler;
  }

  public get $target(): ChannelTarget {
    return this.target;
  }

  public set $animationSampler(value: Sampler) {
    this.animationSampler = value;
  }

  public set $target(value: ChannelTarget) {
    this.target = value;
  }

  public getTargetElementSize(): number {
    switch (this.target.path) {
      case 'TRANSLATION':
      case 'SCALE': {
        return 3;
      }
      case 'ROTATION': {
        return 4;
      }

      default: {
        throw new Error(`[Vertecs/Animation] Target path not found: ${this.target.path}`);
      }
    }
  }
}
