import Sampler from "./Sampler";
import ChannelTarget from "./ChannelTarget";
import Entity from "../../ecs/Entity";

export interface AnimationChannelJson {
  sampler: number;
  target: {
    path: string;
    node: number;
  };
}

export default class AnimationChannel {
  private animationSampler: Sampler;

  private target: ChannelTarget;

  public constructor(animationSampler: Sampler, target: ChannelTarget) {
    this.animationSampler = animationSampler;
    this.target = target;
  }

  public static fromJson(json: AnimationChannelJson, samplers: Sampler[], nodes: Entity[]): AnimationChannel {
    return new AnimationChannel(
      samplers[json.sampler],
      ChannelTarget.fromJson(json.target, nodes)
    );
  }

  public static toJson(): AnimationChannelJson {
    throw new Error("Not yet implemented.");
  }

  public get $animationSampler(): Sampler {
    return this.animationSampler;
  }

  public set $animationSampler(value: Sampler) {
    this.animationSampler = value;
  }

  public get $target(): ChannelTarget {
    return this.target;
  }

  public set $target(value: ChannelTarget) {
    this.target = value;
  }

  public getTargetElementSize(): number {
    switch (this.target.path) {
      case "TRANSLATION" || "SCALE":
        return 3;
      case "ROTATION":
        return 4;
      default:
        throw new Error(`[Vertecs/Animation] Target path not found: ${this.target.path}`);
    }
  }
}
