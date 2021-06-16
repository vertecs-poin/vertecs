import { Component } from "../../ecs";
import { Transform } from "../../math";
import Animation from "../Animation";

export default class AnimationComponent extends Component {
  readonly #animations: Animation[];
  #playingAnimation: number;
  #currentTime: number;

  public constructor() {
    super();
    this.#animations = [];
    this.#playingAnimation = -1;
    this.#currentTime = -1;
  }

  public playAnimation(animationIndex: number, options?: { replay?: boolean }) {
    this.#playingAnimation = animationIndex;
    this.#currentTime = 0;
    const animation = this.animations[this.#playingAnimation];
    if (!animation) {
      return console.error(`Animation not found with index : ${this.#playingAnimation} ignoring play...`);
    }
    animation.replay = options?.replay ?? false;
  }

  public update(timePassed: number): void {
    if (this.#playingAnimation < 0) {
      // No active animation
      return;
    }
    const currentAnimation = this.animations[this.#playingAnimation];

    if (!currentAnimation) {
      return console.error(`Animation not found with index : ${this.#playingAnimation} ignoring update...`);
    }

    this.#currentTime += timePassed;
    currentAnimation.update(this.#currentTime);
  }

  public get animations(): Animation[] {
    return this.#animations;
  }
}
