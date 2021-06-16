import AnimationSampler from "./AnimationSampler";
import { quat, vec3 } from "gl-matrix";
import MathUtils from "../utils/MathUtils";

export default class LinearAnimationSampler extends AnimationSampler {

  public constructor(input: number[], output: Float32Array) {
    super(input, output);
  }

  public getTranslation(currentTime: number): Float32Array {
    // Set max time to the animation max time
    currentTime = Math.min(currentTime, this.input[this.input.length - 1]);

    const previousTimeIndex = this.getPreviousKeyframe(currentTime);
    const previousTime = this.$input[previousTimeIndex];
    const previousTranslation = this.$output.slice(3 * previousTimeIndex, 3 * previousTimeIndex + 3);

    const nextTimeIndex = this.getNextKeyframe(currentTime);
    const nextTime = this.$input[nextTimeIndex];
    const nextTranslation = this.$output.slice(3 * nextTimeIndex, 3 * nextTimeIndex + 3);

    const result = new Float32Array(3);
    const interpolationValue = MathUtils.map(previousTime, currentTime, nextTime);

    vec3.lerp(result, previousTranslation, nextTranslation, interpolationValue);

    return result;
  }

  public getRotation(currentTime: number): Float32Array {
    // Set max time to the animation max time
    currentTime = Math.min(currentTime, this.input[this.input.length - 1]);

    const previousTimeIndex = this.getPreviousKeyframe(currentTime);
    const previousTime = this.$input[previousTimeIndex];
    const previousValue = this.$output.slice(4 * previousTimeIndex, 4 * previousTimeIndex + 4);

    const nextTimeIndex = this.getNextKeyframe(currentTime);
    const nextTime = this.$input[nextTimeIndex];
    const nextValue = this.$output.slice(4 * nextTimeIndex, 4 * nextTimeIndex + 4);

    const result = new Float32Array(4);
    quat.slerp(result, previousValue, nextValue, MathUtils.map(previousTime, currentTime, nextTime));

    return result;
  };
}
