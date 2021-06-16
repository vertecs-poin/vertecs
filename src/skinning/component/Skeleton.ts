import Component from "../../ecs/Component";

export class Skeleton extends Component {

  public constructor() {
    super();
  }

  public clone(): Component {
    return this;
  }
}
