export default abstract class AnimationSampler {
  protected $input: number[];
  protected $currentKeyframe: number;
  protected $output: Float32Array;

  protected constructor(input: number[], output: Float32Array) {
    this.$input = input;
    this.$currentKeyframe = 0;
    this.$output = output;
  }

  protected getPreviousKeyframe(currentTime: number): number {
    for (let i = 0; i < this.input.length - 1; i++) {
      if (this.input[i] > currentTime) {
        return i - 1;
      }
    }
    return this.input.length - 2;
  }

  protected getNextKeyframe(currentTime: number): number {
    for (let i = 1; i < this.input.length - 1; i++) {
      if (this.input[i] > currentTime) {
        return i;
      }
    }
    return this.input.length - 1;
  }

  /**
   * Compute the current interpolation value
   * @param currentTime The current time, since the beginning of the animation, in second
   * @protected
   */
  public abstract getRotation(currentTime: number): Float32Array;

  /**
   * Compute the current interpolation value
   * @param currentTime The current time, since the beginning of the animation, in second
   * @protected
   */
  public abstract getTranslation(currentTime: number): Float32Array;

  public get input(): number[] {
    return this.$input;
  }

  public set input(value: number[]) {
    this.$input = value;
  }

  public get currentKeyframe(): number {
    return this.$currentKeyframe;
  }

  public set currentKeyframe(value: number) {
    this.$currentKeyframe = value;
  }
}
