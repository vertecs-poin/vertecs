import { assert } from 'chai';

describe('FileUtils', () => {
  const entity = new Entity();
  let transform: Transform;

  beforeEach(() => {
    transform = new Transform();
    entity.addComponent(transform);
  });

  describe('Data uri', () => {
    it("should load the correct data", () => {
      assert.fail();
    });
  });
});
