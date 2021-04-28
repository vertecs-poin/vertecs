import { Component } from "../../ecs";
import { Transform } from "../../math";
import Animation from "../Animation";
import Performance from "../../utils/Performance";

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

  public playAnimation(animationIndex: number) {
    this.#playingAnimation = animationIndex;
    this.#currentTime = 0;
  }

  public update(transform: Transform, timePassed: number) {
    if (this.#playingAnimation < 0) return;

    this.#currentTime += timePassed;
    this.animations[this.#playingAnimation].update(transform, this.#currentTime);
  }

  public get animations(): Animation[] {
    return this.#animations;
  }
}
