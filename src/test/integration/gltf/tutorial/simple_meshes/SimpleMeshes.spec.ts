import simpleMeshes from "./simple_meshes.json";
import { assert } from "chai";
import { mat4, vec3 } from "gl-matrix";
import { Entity } from "../../../../../ecs";
import { GltfFactory, Mesh } from "../../../../../gltf";
import { Transform } from "../../../../../math";

describe("Simple meshes", () => {
  let entity: Entity;
  let scene: Entity;
  let node0: Entity | undefined;
  let node1: Entity | undefined;

  before(async () => {
    entity = (await GltfFactory.fromJson(simpleMeshes))!;
    scene = entity.findChildByName("scene")!;
    node0 = scene.findChildByName("node0")!;
    node1 = scene.findChildByName("node1")!;
  });

  it("should have a scene with 2 nodes", () => {
    assert.exists(scene, "Scene not found");
    assert.lengthOf(scene?.children, 2);
  });

  it("should have the correct positions", () => {
    const worldPositionNode0 = mat4.getTranslation(vec3.create(), node0!.getComponent(Transform)!.getModelToWorldMatrix());
    const worldPositionNode1 = mat4.getTranslation(vec3.create(), node1!.getComponent(Transform)!.getModelToWorldMatrix());

    assert.sameOrderedMembers(Array.from(worldPositionNode0), [0, 0, 0]);
    assert.sameOrderedMembers(Array.from(worldPositionNode1), [1, 0, 0]);
  });

  it("should have the same mesh", () => {
    const mesh0 = node0?.getComponent(Mesh);
    const mesh1 = node1?.getComponent(Mesh);

    assert.equal(mesh0?.id, mesh1?.id);
  });
});
