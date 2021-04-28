import { Entity, GLTFFactory, Transform } from "../../../../src";
import simpleAnimation from "./simple_animation.json";
import { assert } from "chai";
import { quat } from "gl-matrix";
import AnimationComponent from "../../../../src/animation/components/AnimationComponent";

describe("Simple Animation", () => {
  let entity: Entity;
  let node: Entity;
  let transform: Transform;
  let animationComponent: AnimationComponent;

  before(async () => {
    entity = await GLTFFactory.fromJson(simpleAnimation) ?? new Entity();
  });

  it("should have a node with an AnimationComponent and a Transform", () => {
    node = entity.findChildByName("node")!;
    transform = node.getComponent(Transform);
    animationComponent = node.getComponent(AnimationComponent);

    assert.isDefined(node, "Mesh not found");
    assert.isDefined(transform, "Transform not found");
    assert.isDefined(animationComponent, "AnimationComponent not found");
  });

  it("should have 1 sampler", () => {
    assert.isDefined(animationComponent.animations[0], "Animation not found");
    assert.lengthOf(animationComponent.animations[0].targets, 1, "Animation component does not have exactly 1 sampler");
  });

  it("should start in its initial orientation", async () => {
    assert.isTrue(quat.equals(transform.getWorldRotation(quat.create()), quat.create()), "triangle not in its initial orientation");
  });

  it("should rotate by 90 degrees in the z axis at .25s", async () => {
    animationComponent.playAnimation(0);

    animationComponent.update(transform, 0.25);
    const result = transform.getWorldRotation(quat.create());

    const expected = quat.fromEuler(quat.create(), 0.0, 0.0, 90);
    assert.isTrue(quat.equals(result, expected), `${result} not rotated by 90 degrees in the z axis at .25s (expected: ${expected})`);
  });

  it("should rotate by 180 degrees in the z axis at .5s", async () => {
    animationComponent.playAnimation(0);

    animationComponent.update(transform, 0.5);
    const result = transform.getWorldRotation(quat.create());

    const expected = quat.fromEuler(quat.create(), 0.0, 0.0, 180);
    assert.isTrue(quat.equals(result, expected), `${result} not rotated by 180 degrees in the z axis at .5s (expected: ${expected})`);
  });

  it("should rotate by 270 degrees in the z axis at .75s", async () => {
    animationComponent.playAnimation(0);

    animationComponent.update(transform, 0.75);
    const result = transform.getWorldRotation(quat.create());

    const expected = quat.fromEuler(quat.create(), 0.0, 0.0, 270);
    assert.isTrue(quat.equals(result, expected), `${result} not rotated by 270 degrees in the z axis at .75s (expected: ${expected})`);
  });

  it("should rotate by 360 degrees in the z axis at 1s", async () => {
    animationComponent.playAnimation(0);

    animationComponent.update(transform, 1);
    const result = transform.getWorldRotation(quat.create());

    const expected = quat.fromEuler(quat.create(), 0.0, 0.0, 360);
    assert.isTrue(quat.equals(result, expected), `${result} not rotated by 360 degrees in the z axis at 1s (expected: ${expected})`);
  });

  it("should stay at 360 degrees after 1s", async () => {
    animationComponent.playAnimation(0);

    animationComponent.update(transform, 1.25);
    const result = transform.getWorldRotation(quat.create());

    const expected = quat.fromEuler(quat.create(), 0.0, 0.0, 360);
    assert.isTrue(quat.equals(result, expected), `${result} not rotated by 360 degrees in the z axis at 1.25s (expected: ${expected})`);
  });
});
