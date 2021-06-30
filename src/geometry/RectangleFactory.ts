import { Entity } from "../ecs";
import { Accessor, Material, Mesh, Primitive } from "../gltf";
import Transform from "../math/components/Transform";

const positions = [
  -0.5, 0.5, 0,
  -0.5, -0.5, 0,
  0.5, -0.5, 0,
  0.5, -0.5, 0,
  0.5, 0.5, 0,
  -0.5, 0.5, 0
];

export default class RectangleFactory {

  public static create(width: number, height: number): Entity {
    const rectangle = new Entity();

    const attributes = new Map<string, Accessor>();
    const positionAccessor = Accessor.fromPositions(positions, "VEC3");
    attributes.set("POSITION", positionAccessor);

    const material = new Material({ doubleSided: true });

    const primitives = [new Primitive(attributes, { material })];
    rectangle.addComponent(new Mesh(primitives));
    rectangle.addComponent(new Transform(undefined, undefined, undefined, [width, height, 1]));

    return rectangle;
  }
}
