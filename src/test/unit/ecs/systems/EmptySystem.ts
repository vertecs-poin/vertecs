import EmptyComponent from "../components/EmptyComponent";
import { System } from "../../../../ecs";

/**
 * Empty system
 */
export default class EmptySystem extends System<[EmptyComponent]> {

  public constructor() {
    super([EmptyComponent]);
  }

  public initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public onUpdate(): void {
  }
}
