import { assert } from 'chai';
import minimal from './minimal.json';
import { Entity, GLTF, Primitive, Transform } from "../../src";

describe('GLTF minimal file', () => {
  let gltf: Entity;
  beforeEach(async () => {
    const entity = await GLTF.fromJson(minimal);

    if (!entity) {
      assert.fail('Failed to import minimal gltf file');
      throw new Error('Null entity');
    }

    gltf = entity;
  });

  it('should have a single scene child', () => {
    assert.equal(gltf.children.length, 1);
  });

  it('should have the correct scene', () => {
    const scene = gltf.children[0];

    const transform = scene.getComponent(Transform);

    assert.equal(scene.name, 'test scene');
    assert.isNotNull(transform);
  });

  it('should have the correct node', () => {
    const scene = gltf.children[0];
    const mesh = scene.children[0];

    const transform = scene.getComponent(Transform);

    assert.isNotNull(transform);
    assert.equal(mesh.name, 'test node');
  });

  it('should have the correct mesh', () => {
    const scene = gltf.children[0];
    const node = scene.children[0];
    const mesh = node.children[0];

    const transform = scene.getComponent(Transform);

    assert.isNotNull(transform);
    assert.equal(mesh.name, 'test mesh');
  });

  it('should have the correct primitive', () => {
    const scene = gltf.children[0];
    const node = scene.children[0];
    const mesh = node.children[0];
    const primitiveNode = mesh.children[0];

    const primitive = primitiveNode.getComponent(Primitive);

    assert.isNotNull(primitive);
    assert.equal(primitiveNode.name, 'test primitive');
  });
});
