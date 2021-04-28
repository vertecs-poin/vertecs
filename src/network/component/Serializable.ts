import { Component } from "../../ecs";

export abstract class Serializable extends Component {

  public constructor() {
    super();
  }

  protected abstract serialize(): any;

  protected abstract deserialize(): any;
}
