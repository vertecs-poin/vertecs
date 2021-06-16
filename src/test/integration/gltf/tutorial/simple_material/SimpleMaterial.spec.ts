import simpleMaterial from "./simple_material.json";
import { assert } from "chai";
import { Entity } from "../../../../../ecs";
import { GltfFactory, Mesh, Primitive } from "../../../../../gltf";

describe("Simple material", () => {
  let entity: Entity;
  let scene: Entity;
  let mesh: Mesh;
  let primitive: Primitive;

  before(async () => {
    entity = (await GltfFactory.fromJson(simpleMaterial))!;
    scene = entity.findChildByName("scene")!;
  });

  it("should have a mesh with one primitive", () => {
    const node = scene.children[0];

    mesh = node.getComponent(Mesh)!;

    assert.isDefined(mesh);
    assert.lengthOf(mesh.primitives, 1);
  });

  it("should have a material with the correct color", () => {
    primitive = mesh.primitives[0];

    const pbrMetallicRoughness = primitive.material.pbrMetallicRoughness;

    assert.sameOrderedMembers(Array.from(pbrMetallicRoughness.baseColorFactor), [1.000, 0.766, 0.336, 1.0]);
    assert.equal(pbrMetallicRoughness.metallicFactor, 0.5);
    assert.equal(pbrMetallicRoughness.roughnessFactor, 0.1);
  });
});
