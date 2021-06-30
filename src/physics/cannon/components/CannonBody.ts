import { Component } from "../../../ecs";
import { Body, Box, Vec3 } from "cannon-es";

export default class CannonBody extends Component {
  #body: Body;

  public constructor() {
    super();
    this.#body = new Body({ mass: 8 });
    this.#body.addShape(new Box(new Vec3(.5, .5, .5)));
    this.#body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  }

  public get body(): Body {
    return this.#body;
  }

  public set body(value: Body) {
    this.#body = value;
  }
}
