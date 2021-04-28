import { Mesh } from "../../gltf";
import { Transform } from "../../math";
import PrimitiveViewComponent from "./PrimitiveViewComponent";
import { Component } from "../../ecs";

export default class MeshViewComponent extends Component {
  readonly #mesh: Mesh;
  readonly #primitiveViews: PrimitiveViewComponent[];

  public constructor(mesh: Mesh) {
    super();
    this.#mesh = mesh;
    this.#primitiveViews = this.#mesh.primitives.map(primitive => {
      const primitiveView = new PrimitiveViewComponent(primitive);
      primitiveView.initialize();
      return primitiveView;
    });
  }

  public draw(transform: Transform) {
    this.#primitiveViews.forEach(primitiveView => primitiveView.draw(transform));
  }
}
