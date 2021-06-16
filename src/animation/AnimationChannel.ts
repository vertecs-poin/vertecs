import AnimationSampler from "./AnimationSampler";
import { Entity } from "../ecs";

export default class AnimationChannel {
  #sampler: AnimationSampler;
  #path: string;
  #node: Entity;

  public constructor(node: Entity, path: string, sampler: AnimationSampler) {
    this.#path = path;
    this.#sampler = sampler;
    this.#node = node;
  }

  public get node(): Entity {
    return this.#node;
  }

  public set node(value: Entity) {
    this.#node = value;
  }

  public get sampler(): AnimationSampler {
    return this.#sampler;
  }

  public set sampler(value: AnimationSampler) {
    this.#sampler = value;
  }

  public get path(): string {
    return this.#path;
  }

  public set path(value: string) {
    this.#path = value;
  }
}
