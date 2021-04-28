import { Entity, GLTFFactory, Material } from "../../../../src";
import simpleMeshes from "./simple_texture.json";
import { assert } from "chai";

describe("Simple texture", () => {
  let gltf: Entity;

  before(async () => {
    gltf = await GLTFFactory.fromJson(simpleMeshes) ?? new Entity();
  });

  it("should have the correct pbr material", () => {
    const mesh = gltf?.findChildByName("node0");
    const material = mesh?.getComponent(Material);

    assert.exists(mesh);
    assert.exists(material);
    assert.equal(material.pbrMetallicRoughness.metallicFactor, 0.0);
    assert.equal(material.pbrMetallicRoughness.roughnessFactor, 1.0);
    assert.exists(material.pbrMetallicRoughness.baseColorTextureInfo);
  });
});
