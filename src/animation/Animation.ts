import AnimationChannel from "./AnimationChannel";
import { Transform } from "../math";

export default class Animation {
  #channels: AnimationChannel[];
  #replay: boolean;
  #length: number;

  public constructor() {
    this.#channels = [];
    this.#replay = false;
    this.#length = 0;
  }

  public update(timePassed: number) {
    if (this.#replay) {
      // Replay animation when all channels finish
      let maxTime = 0;
      this.channels.forEach(channel => {
        const input = channel.sampler.input;
        // TODO: getter for channel duration
        const lastTime = input[input.length - 1];
        if (lastTime > maxTime) {
          maxTime = lastTime;
        }
      });
      timePassed %= maxTime;
    }

    this.channels.forEach(channel => {
      const transform = channel.node.getComponent(Transform);
      if (!transform) {
        throw new Error("Animation target doesn't have a transform attached");
      }

      switch (channel.path) {
        case "rotation":
          transform.setRotationQuat(channel.sampler.getRotation(timePassed));
          break;
        case "translation":
          transform.setPosition(channel.sampler.getTranslation(timePassed));
          break;
        case "scale":
          transform.setScale(channel.sampler.getTranslation(timePassed));
          break;
        default:
          throw new Error(`Sampler path not supported ${channel.path}`);
      }
    });
  }

  public get replay(): boolean {
    return this.#replay;
  }

  public set replay(value: boolean) {
    this.#replay = value;
  }

  public get channels(): AnimationChannel[] {
    return this.#channels;
  }

  public set channels(channels: AnimationChannel[]) {
    this.#channels = channels;
  }
}
