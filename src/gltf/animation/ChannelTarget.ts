import Entity from "../../ecs/Entity";

export default class ChannelTarget {
  #node: Entity;

  #path: string;

  public constructor(node: Entity, path: string) {
    this.#node = node;
    this.#path = path;
  }

  public static fromJson(json: any, nodes: Entity[]) {
    const node = nodes[json.node];
    const { path } = json;

    return new ChannelTarget(node, path);
  }

  public get node(): Entity {
    return this.#node;
  }

  public get path(): string {
    return this.#path;
  }

  public set node(value: Entity) {
    this.#node = value;
  }

  public set path(value: string) {
    this.#path = value;
  }
}
