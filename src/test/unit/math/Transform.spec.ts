import { assert } from "chai";
import { mat4, quat, vec3 } from "gl-matrix";
import { Transform } from "../../../math";
import { Entity } from "../../../ecs";

describe("Transform", () => {
  let entity = new Entity({ name: "entity_transform_test" });
  let transform: Transform;

  beforeEach(() => {
    entity = new Entity();
    transform = new Transform();
    entity.addComponent(transform);
  });

  describe("Constructor", () => {
    it("should be at scaled (2, 2, 2)", () => {
      const transform = new Transform(undefined, undefined, undefined, [2, 2, 2]);

      assert.sameOrderedMembers(Array.from(transform.scaling), [2, 2, 2]);
    });

    it("should be at translated (2, 2, 2)", () => {
      const transform = new Transform(undefined, [2, 2, 2]);

      assert.sameOrderedMembers(Array.from(transform.position), [2, 2, 2]);
    });
  });

  describe("Translation", () => {
    describe("Simple", () => {
      it("should be at origin (0, 0, 0)", () => {
        const worldPosition = transform.getWorldTranslation(vec3.create());

        assert.sameOrderedMembers(Array.from(worldPosition), [0, 0, 0]);
      });

      it("should translate by 2 units in the y axis", () => {
        transform.translate([0, 2, 0]);
        const worldPosition = transform.getWorldTranslation(vec3.create());

        assert.sameOrderedMembers(Array.from(worldPosition), [0, 2, 0]);
      });
    });
  });

  describe("Scale", () => {
    describe("Simple", () => {
      it("should be at default scale (1, 1, 1)", () => {
        const scale = transform.getWorldScale(vec3.create());

        assert.sameOrderedMembers(Array.from(scale), [1, 1, 1]);
      });

      it("should scale by 2 units in the y axis (1, 2, 1)", () => {
        transform.scaleXYZ(1, 2, 1);
        const worldScale = transform.getWorldScale(vec3.create());

        assert.sameOrderedMembers(Array.from(worldScale), [1, 2, 1]);
      });
    });

    describe("With hierarchy", () => {
      const childTransform = new Transform();
      const childEntity = new Entity();
      childEntity.addComponent(childTransform);

      it("should translate by 2 units in the y axis", () => {
        entity.addChild(childEntity);

        transform.translate([0, 2, 0]);

        assert.sameOrderedMembers(Array.from(transform.getWorldTranslation(vec3.create())), [0, 2, 0]);
      });
    });
  });

  describe("Rotation", () => {
    describe("Simple", () => {
      it("should rotates by pi/2 on the x axis", () => {
        const rotationEntity = new Entity();
        const rotationTransform = new Transform();
        rotationEntity.addComponent(rotationTransform);
        rotationTransform.rotateX(Math.PI / 2);

        const modelToWorldMatrix = rotationTransform.getModelToWorldMatrix();
        const result = mat4.getRotation(quat.create(), modelToWorldMatrix);

        const expected = quat.fromEuler(quat.create(), Math.PI / 2 * 180 / Math.PI, 0, 0);
        assert.isTrue(quat.equals(result, expected), `${result} : not rotated by pi/2 on the x axis (expected: ${expected})`);
      });
    });

    describe("With hierarchy", () => {
      it("should cancels rotation", () => {
        const childEntity = new Entity();
        const childTransform = new Transform();
        childEntity.addComponent(childTransform);
        entity.addChild(childEntity);

        transform.rotateX(Math.PI / 2);
        childTransform.rotateX(-Math.PI / 2);
        const result = childTransform.getWorldRotation(quat.create());

        const expected = quat.create();
        assert.isTrue(quat.equals(result, expected), `${result} not cancelled (expected: ${expected})`);
      });
    });
  });
});
