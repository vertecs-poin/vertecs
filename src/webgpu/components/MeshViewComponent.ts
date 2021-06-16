import { Mesh } from "../../gltf";
import { Transform } from "../../math";
import PrimitiveViewComponent from "./PrimitiveViewComponent";
import { Component, Entity } from "../../ecs";
import { Skin } from "../../skinning";

export default class MeshViewComponent extends Component {
  readonly #mesh?: Mesh;
  readonly #primitiveViews?: PrimitiveViewComponent[];

  public constructor(entity: Entity) {
    super();
    const skin = entity.getComponent(Skin);
    this.#mesh = entity.getComponent(Mesh);
    this.#primitiveViews = this.#mesh?.primitives.map(primitive => {
      const primitiveView = new PrimitiveViewComponent(primitive, skin);
      primitiveView.initialize();
      return primitiveView;
    });
  }

  public draw(transform: Transform) {
    this.#primitiveViews?.forEach(primitiveView => primitiveView.draw(transform));
  }
}
