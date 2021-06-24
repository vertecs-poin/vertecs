import { Entity } from "../ecs";
import { Accessor, Mesh, Primitive } from "../gltf";
import Transform from "../math/components/Transform";

const positions = [
  0.5, -0.5, 0.5,
  -0.5, -0.5, 0.5,
  -0.5, -0.5, -0.5,
  0.5, -0.5, -0.5,
  0.5, -0.5, 0.5,
  -0.5, -0.5, -0.5,

  0.5, 0.5, 0.5,
  0.5, -0.5, 0.5,
  0.5, -0.5, -0.5,
  0.5, 0.5, -0.5,
  0.5, 0.5, 0.5,
  0.5, -0.5, -0.5,

  -0.5, 0.5, 0.5,
  0.5, 0.5, 0.5,
  0.5, 0.5, -0.5,
  -0.5, 0.5, -0.5,
  -0.5, 0.5, 0.5,
  0.5, 0.5, -0.5,

  -0.5, -0.5, 0.5,
  -0.5, 0.5, 0.5,
  -0.5, 0.5, -0.5,
  -0.5, -0.5, -0.5,
  -0.5, -0.5, 0.5,
  -0.5, 0.5, -0.5,

  0.5, 0.5, 0.5,
  -0.5, 0.5, 0.5,
  -0.5, -0.5, 0.5,
  -0.5, -0.5, 0.5,
  0.5, -0.5, 0.5,
  0.5, 0.5, 0.5,

  0.5, -0.5, -0.5,
  -0.5, -0.5, -0.5,
  -0.5, 0.5, -0.5,
  0.5, 0.5, -0.5,
  0.5, -0.5, -0.5,
  -0.5, 0.5, -0.5
];

export default class CubeFactory {

  public static create(width: number, height: number, depth: number): Entity {
    const cube = new Entity();

    const attributes = new Map<string, Accessor>();
    const positionAccessor = Accessor.fromPositions(positions, "VEC3");
    attributes.set("POSITION", positionAccessor);

    const primitives = [new Primitive(attributes)];
    cube.addComponent(new Mesh(primitives));
    cube.addComponent(new Transform(undefined, undefined, undefined, [width, height, depth]));

    return cube;
  }
}
