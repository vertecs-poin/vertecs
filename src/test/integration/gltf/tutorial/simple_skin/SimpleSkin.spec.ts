import simpleSkin from "./simple_skin.json";
import { assert } from "chai";
import { Ecs, Entity } from "../../../../../ecs";
import { SkeletalAnimationSystem, Skin } from "../../../../../skinning";
import { GltfFactory, Mesh } from "../../../../../gltf";
import { AnimationComponent } from "../../../../../animation";
import { Transform } from "../../../../../math";

describe("Simple skin", () => {
  let gltf: Entity;
  let scene: Entity;
  let mainNode: Entity;
  let secondNode: Entity;
  let thirdNode: Entity;
  let animationEntity: Entity;
  let skeletalAnimationSystem: SkeletalAnimationSystem;

  before(async () => {
    skeletalAnimationSystem = new SkeletalAnimationSystem(16);
    await Ecs.addSystem(skeletalAnimationSystem);

    gltf = (await GltfFactory.fromJson(simpleSkin))!;
    scene = gltf.children[0];
    mainNode = scene?.children[0];
    secondNode = mainNode?.children[0];
    thirdNode = secondNode?.children[0];
    animationEntity = mainNode.findChildByComponent(AnimationComponent)!;
  });

  describe("initial position", () => {
    it("should have a scene with a single child node", () => {
      assert.exists(scene);
      assert.lengthOf(scene?.children, 1);
    });

    it("should have a main node with a skin, a mesh and a child", () => {
      const skin = mainNode.getComponent(Skin);
      const mesh = mainNode.getComponent(Mesh);

      assert.exists(mainNode);
      assert.exists(skin);
      assert.exists(mesh);
    });

    it("should have a second node with the correct position", () => {
      secondNode = mainNode.findChildByName("node1")!;

      assert.exists(secondNode);
    });

    it("should have a third node with the correct position", () => {
      thirdNode = secondNode.findChildByName("node2")!;

      assert.exists(thirdNode);
    });
  });

  describe("data", () => {
    it("should the correct weights", () => {
      const weights = scene.findChildByComponent(Mesh)?.getComponent(Mesh)?.primitives[0].attributes.get("WEIGHTS_0");

      assert.sameOrderedMembers(
        Array.from(weights!.getDataAsFloat32Array()), [
          1.00, 0.00, 0.0, 0.0,
          1.00, 0.00, 0.0, 0.0,
          0.75, 0.25, 0.0, 0.0,
          0.75, 0.25, 0.0, 0.0,
          0.50, 0.50, 0.0, 0.0,
          0.50, 0.50, 0.0, 0.0,
          0.25, 0.75, 0.0, 0.0,
          0.25, 0.75, 0.0, 0.0,
          0.00, 1.00, 0.0, 0.0,
          0.00, 1.00, 0.0, 0.0
        ]);
    });

    it("should the correct joints", () => {
      const joints = scene.findChildByComponent(Mesh)?.getComponent(Mesh)?.primitives[0].attributes.get("JOINTS_0");

      assert.sameOrderedMembers(
        Array.from(joints!.getDataAsInt16Array()), [
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 1, 0, 0,
          0, 1, 0, 0,
          0, 1, 0, 0,
          0, 1, 0, 0,
          0, 1, 0, 0,
          0, 1, 0, 0,
          0, 1, 0, 0,
          0, 1, 0, 0
        ]);
    });

    it("should have a main node with a skin, a mesh and a child", () => {
      const skin = mainNode.getComponent(Skin);
      const mesh = mainNode.getComponent(Mesh);

      assert.exists(mainNode);
      assert.exists(skin);
      assert.exists(mesh);
    });

    it("should have a second node with the correct position", () => {
      secondNode = mainNode.findChildByName("node1")!;

      assert.exists(secondNode);
    });

    it("should have a third node with the correct position", () => {
      thirdNode = secondNode.findChildByName("node2")!;

      assert.exists(thirdNode);
    });
  });

  describe("animation", () => {
    it("should have an amination attached", () => {
      const animation = animationEntity?.getComponent(AnimationComponent);
      const transform = animationEntity?.getComponent(Transform);

      assert.isDefined(animation);
      assert.isDefined(transform);

      if (animation && transform) {
        animation.playAnimation(0);
        animation.update(1000);
        skeletalAnimationSystem.update();
      }
    });
  });
});
