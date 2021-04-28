import AnimationSampler from "./AnimationSampler";

export default class AnimationSamplerTarget {
  #sampler: AnimationSampler;
  #path: string;

  public constructor(path: string, sampler: AnimationSampler) {
    this.#path = path;
    this.#sampler = sampler;
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
