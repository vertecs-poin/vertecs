import { Serializable } from "../component/Serializable";
import { System } from "../../ecs";

export default abstract class NetworkSystem extends System<[Serializable]> {

  protected constructor(tps?: number) {
    super([Serializable], tps);
  }

  protected abstract onEntityReceived(): void;

  protected abstract onEntitySent(): void;

  public async initialize(): Promise<void> {
  }

  public onUpdate(): void {
  }
}
