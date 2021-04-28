import { CameraComponent, Entity, GLTFFactory, Mesh } from "../../../../src";
import simpleMaterial from "./simple_cameras.json";
import { assert } from "chai";
import CameraViewComponent from "../../../../src/webgpu/components/CameraViewComponent";
import Transform from "../../../../src/math/components/Transform";

describe("Simple cameras", () => {
  let gltf: Entity;
  let scene: Entity;

  before(async () => {
    gltf = (await GLTFFactory.fromJson(simpleMaterial))!;
    scene = gltf.children[0];
  });

  it("should have 3 nodes", () => {
    const nodes = scene.children;

    assert.lengthOf(nodes, 3);
  });

  it("should have the correct mesh", () => {
    const node0 = scene.findChildByName("node0")!;
    const [transform, mesh] = node0.getComponents([Transform, Mesh]);

    assert.exists(node0);
    assert.exists(transform);
    assert.sameOrderedMembers(Array.from(transform.rotation), [-0.382999986410141, 0, 0, 0.9240000247955322]);
    assert.exists(mesh);
  });

  it("should have the correct first camera", () => {
    const node1 = scene.findChildByName("node1")!;
    const [transform, camera] = node1.getComponents([Transform, CameraComponent]);

    assert.exists(transform);
    assert.sameOrderedMembers(Array.from(transform.position), [0.5, 0.5, 3.0]);
    assert.exists(camera);
    assert.equal(camera.type, "perspective");
  });

  it("should have the correct second camera", () => {
    const node2 = scene.findChildByName("node2")!;
    const [transform, camera] = node2.getComponents([Transform, CameraComponent]);

    assert.exists(transform);
    assert.sameOrderedMembers(Array.from(transform.position), [0.5, 0.5, 3.0]);
    assert.exists(camera);
    assert.equal(camera.type, "orthographic");
  });
});
