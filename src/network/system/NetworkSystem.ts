import { System } from "../../ecs";
import { Serializable } from "../component/Serializable";

export default abstract class NetworkSystem extends System {

  protected constructor(tps?: number) {
    super([Serializable], tps);
  }

  protected abstract onEntityReceived(): void;

  protected abstract onEntitySent(): void;

  public async initialize(): Promise<void> {
  }

  public onUpdate(timePassed: number): void {
  }
}
