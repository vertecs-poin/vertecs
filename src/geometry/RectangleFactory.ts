import { Entity } from "../ecs";
import { Accessor, Mesh } from "../gltf";
import Transform from "../math/components/Transform";

const positions = [
  -0.5, 0.5, 0,
  -0.5, -0.5, 0,
  0.5, -0.5, 0,
  0.5, -0.5, 0,
  0.5, 0.5, 0,
  -0.5, 0.5, 0,
];

export default class RectangleFactory {

  public static create(width: number, height: number): Entity {
    const rectangle = new Entity();

    const value = Accessor.fromPositions(positions, "VEC3");

    rectangle.addComponent(Mesh.fromJson({
      "primitives": [{
        "attributes": {
          "POSITION": 0
        }
      }]
    }, [value]));
    rectangle.addComponent(new Transform(undefined, undefined, undefined, [width, height, 1]));

    return rectangle;
  }
}
