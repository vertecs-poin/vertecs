import { Entity, GLTFFactory, Mesh, Transform } from "../../../../src";
import simpleMeshes from "./simple_meshes.json";
import { assert } from "chai";

describe("Simple meshes", () => {
  let entity: Entity;
  let scene: Entity;
  let node0: Entity | undefined;
  let node1: Entity | undefined;

  before(async () => {
    entity = (await GLTFFactory.fromJson(simpleMeshes))!;
    scene = entity.findChildByName("scene")!;
  });

  it("should have a scene with 2 nodes", () => {
    assert.exists(scene, "Scene not found");
    assert.lengthOf(scene?.children, 2);
  });

  it("should have the correct positions", () => {
    node0 = scene?.findChildByName("node0");
    node1 = scene?.findChildByName("node1");

    assert.sameOrderedMembers(Array.from(node0?.getComponent(Transform)?.position), [0, 0, 0]);
    assert.sameOrderedMembers(Array.from(node1?.getComponent(Transform)?.position), [1, 0, 0]);
  });

  it("should have the same mesh", () => {
    const mesh0 = node0?.getComponent(Mesh);
    const mesh1 = node1?.getComponent(Mesh);

    assert.equal(mesh0?.id, mesh1?.id);
  });
});
