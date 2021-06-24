import simpleMeshes from "./simple_texture.json";
import { assert } from "chai";
import { Entity } from "../../../../../ecs";
import { GltfFactory, Mesh, Primitive } from "../../../../../gltf";

describe("Simple texture", () => {
  let gltf: Entity;

  before(async () => {
    gltf = await GltfFactory.fromJson(simpleMeshes) ?? new Entity();
  });

  it("should have the correct pbr material", () => {
    const mesh = gltf?.findChildByName("node0");
    const material = mesh?.getComponent(Mesh)?.primitives[0].material;

    assert.exists(mesh);
    assert.exists(material);
    assert.equal(material!.pbrMetallicRoughness.metallicFactor, 0.0);
    assert.equal(material!.pbrMetallicRoughness.roughnessFactor, 1.0);
    assert.exists(material!.pbrMetallicRoughness.baseColorTextureInfo);
  });
});
