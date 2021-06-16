var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import simpleAnimation from "./simple_animation.json";
import { assert } from "chai";
import { quat } from "gl-matrix";
import { AnimationComponent, Entity, GLTFFactory, Transform } from "../../../../../src";
describe("Simple Animation", () => {
    let entity;
    let node;
    let transform;
    let animationComponent;
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        entity = (_a = yield GLTFFactory.fromJson(simpleAnimation)) !== null && _a !== void 0 ? _a : new Entity();
    }));
    it("should have a node with an AnimationComponent and a Transform", () => {
        node = entity.findChildByName("node");
        transform = node.getComponent(Transform);
        animationComponent = node.getComponent(AnimationComponent);
        assert.isDefined(node, "Mesh not found");
        assert.isDefined(transform, "Transform not found");
        assert.isDefined(animationComponent, "AnimationComponent not found");
    });
    it("should have 1 sampler", () => {
        assert.isDefined(animationComponent.animations[0], "Animation not found");
        assert.lengthOf(animationComponent.animations[0].targets, 1, "Animation components does not have exactly 1 sampler");
    });
    it("should start in its initial orientation", () => __awaiter(void 0, void 0, void 0, function* () {
        assert.isTrue(quat.equals(transform.getWorldRotation(quat.create()), quat.create()), "triangle not in its initial orientation");
    }));
    it("should rotate by 90 degrees in the z axis at .25s", () => __awaiter(void 0, void 0, void 0, function* () {
        animationComponent.playAnimation(0);
        animationComponent.update(transform, 0.25);
        const result = transform.getWorldRotation(quat.create());
        const expected = quat.fromEuler(quat.create(), 0.0, 0.0, 90);
        assert.isTrue(quat.equals(result, expected), `${result} not rotated by 90 degrees in the z axis at .25s (expected: ${expected})`);
    }));
    it("should rotate by 180 degrees in the z axis at .5s", () => __awaiter(void 0, void 0, void 0, function* () {
        animationComponent.playAnimation(0);
        animationComponent.update(transform, 0.5);
        const result = transform.getWorldRotation(quat.create());
        const expected = quat.fromEuler(quat.create(), 0.0, 0.0, 180);
        assert.isTrue(quat.equals(result, expected), `${result} not rotated by 180 degrees in the z axis at .5s (expected: ${expected})`);
    }));
    it("should rotate by 270 degrees in the z axis at .75s", () => __awaiter(void 0, void 0, void 0, function* () {
        animationComponent.playAnimation(0);
        animationComponent.update(transform, 0.75);
        const result = transform.getWorldRotation(quat.create());
        const expected = quat.fromEuler(quat.create(), 0.0, 0.0, 270);
        assert.isTrue(quat.equals(result, expected), `${result} not rotated by 270 degrees in the z axis at .75s (expected: ${expected})`);
    }));
    it("should rotate by 360 degrees in the z axis at 1s", () => __awaiter(void 0, void 0, void 0, function* () {
        animationComponent.playAnimation(0);
        animationComponent.update(transform, 1);
        const result = transform.getWorldRotation(quat.create());
        const expected = quat.fromEuler(quat.create(), 0.0, 0.0, 360);
        assert.isTrue(quat.equals(result, expected), `${result} not rotated by 360 degrees in the z axis at 1s (expected: ${expected})`);
    }));
    it("should stay at 360 degrees after 1s", () => __awaiter(void 0, void 0, void 0, function* () {
        animationComponent.playAnimation(0);
        animationComponent.update(transform, 1.25);
        const result = transform.getWorldRotation(quat.create());
        const expected = quat.fromEuler(quat.create(), 0.0, 0.0, 360);
        assert.isTrue(quat.equals(result, expected), `${result} not rotated by 360 degrees in the z axis at 1.25s (expected: ${expected})`);
    }));
});
//# sourceMappingURL=SimpleAnimation.spec.js.map