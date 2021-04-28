import AnimationSamplerTarget from "./AnimationSamplerTarget";
import { Transform } from "../math";

export default class Animation {
  #targets: AnimationSamplerTarget[];
  #replay: boolean;
  #length: number;

  public constructor() {
    this.#targets = [];
    this.#replay = false;
    this.#length = 0;
  }

  public update(transform: Transform, timePassed: number) {
    if (this.#replay) {
      let maxTime = 0;
      this.targets.forEach(target => {
        let input = target.sampler.input;
        let lastTime = input[input.length - 1];
        if (lastTime > maxTime) {
          maxTime = lastTime;
        }
      });
      timePassed %= maxTime;
    }

    this.targets.forEach(target => {
      switch (target.path) {
        case "rotation":
          transform.setRotationQuat(target.sampler.getRotation(timePassed));
          break;
        case "translation":
          transform.setPosition(target.sampler.getTranslation(timePassed));
          break;
        default:
          throw new Error(`Sampler path not supported ${target.path}`);
      }
    });
  }

  public get replay(): boolean {
    return this.#replay;
  }

  public set replay(value: boolean) {
    this.#replay = value;
  }

  public get targets(): AnimationSamplerTarget[] {
    return this.#targets;
  }

  public set targets(value: AnimationSamplerTarget[]) {
    this.#targets = value;
  }
}
