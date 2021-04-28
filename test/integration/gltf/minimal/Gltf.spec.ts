import { assert } from "chai";
import minimal from "./minimal.json";
import { Entity, GLTFFactory, Transform } from "../../../../src";

describe("GLTF minimal file", () => {
  let gltf: Entity;
  beforeEach(async () => {
    const entity = await GLTFFactory.fromJson(minimal);

    if (!entity) {
      assert.fail("Failed to import minimal gltf file");
      throw new Error("Null entity");
    }

    gltf = entity;
  });

  it("should have a single scene child", () => {
    assert.equal(gltf.children.length, 1);
  });

  it("should have the correct scene", () => {
    const scene = gltf.children[0];

    const transform = scene.getComponent(Transform);

    assert.equal(scene.name, "test scene");
    assert.isNotNull(transform);
  });
});
