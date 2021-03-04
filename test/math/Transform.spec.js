import { assert } from 'chai';
import { mat4, quat, vec3 } from 'gl-matrix';
import { Entity, Transform } from "../../src";
describe('Transform', () => {
    const entity = new Entity();
    let transform;
    beforeEach(() => {
        transform = new Transform();
        entity.addComponent(transform);
    });
    describe('Translation', () => {
        describe('Simple', () => {
            it('should be at origin (0, 0, 0)', () => {
                const worldPosition = transform.getWorldPosition(vec3.create());
                assert.sameOrderedMembers(Array.from(worldPosition), [0, 0, 0]);
            });
            it('should translate by 2 units in the y axis', () => {
                transform.translate([0, 2, 0]);
                const worldPosition = transform.getWorldPosition(vec3.create());
                assert.sameOrderedMembers(Array.from(worldPosition), [0, 2, 0]);
            });
        });
    });
    describe('Scale', () => {
        describe('Simple', () => {
            it('should be at default scale (1, 1, 1)', () => {
                const scale = transform.getWorldScale(vec3.create());
                assert.sameOrderedMembers(Array.from(scale), [1, 1, 1]);
            });
            it('should scale by 2 units in the y axis (1, 2, 1)', () => {
                transform.scaleXYZ(1, 2, 1);
                const worldScale = transform.getWorldScale(vec3.create());
                assert.sameOrderedMembers(Array.from(worldScale), [1, 2, 1]);
            });
        });
        describe('With hierarchy', () => {
            const childTransform = new Transform();
            const childEntity = new Entity();
            childEntity.addComponent(childTransform);
            it('should translate by 2 units in the y axis', () => {
                entity.addChild(childEntity);
                transform.translate([0, 2, 0]);
                assert.sameOrderedMembers(Array.from(transform.getWorldPosition(vec3.create())), [0, 2, 0]);
            });
        });
    });
    describe('Rotation', () => {
        describe('Simple', () => {
            it('should rotates by pi/2 on the x axis', () => {
                const entity = new Entity();
                const transform = new Transform();
                entity.addComponent(transform);
                const halfPi = Math.PI / 2;
                transform.rotateXYZ(halfPi, 0, 0);
                const modelToWorldMatrix = transform.getModelToWorldMatrix();
                const result = mat4.getRotation(quat.create(), modelToWorldMatrix);
                const expected = quat.fromEuler(quat.create(), halfPi * 180 / Math.PI, 0, 0);
                assert.strictEqual(quat.equals(result, expected), true);
            });
        });
        describe('With hierarchy', () => {
            it('should cancels rotation', () => {
                const childEntity = new Entity();
                entity.addChild(childEntity);
                const childTransform = new Transform();
                childEntity.addComponent(childTransform);
                transform.rotateXYZ(Math.PI / 2, 0, 0);
                childTransform.rotateXYZ(-Math.PI / 2, 0, 0);
                const worldRotation = childTransform.getWorldRotation(quat.create());
                assert.isTrue(quat.equals(worldRotation, quat.create()), `${worldRotation} not cancelled`);
            });
        });
    });
});
//# sourceMappingURL=Transform.spec.js.map