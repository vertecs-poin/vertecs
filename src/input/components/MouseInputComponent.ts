import { Component } from "../../ecs";

export default abstract class MouseInputComponent extends Component {

  protected constructor() {
    super();
  }

  public abstract onMouseMove(event: MouseEvent): void;
}
