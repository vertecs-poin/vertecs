import { assert } from 'chai';
import { before } from 'mocha';

describe('BufferView', () => {
  let buffer: Buffer;

  before(async () => {
    buffer = await Buffer.fromJson({
      uri: 'data:application/octet-stream;base64,AAABAAIAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAA=',
      byteLength: 44,
    });
  });

  it('should have the correct size and data', () => {
    const bufferView = new BufferView(buffer, 6, {
      byteOffset: 0,
      target: 34963,
    });

    assert.equal(bufferView.byteLength, 6);
    assert.fail();
  });

  it('should have the correct size', () => {
    const bufferView = new BufferView(buffer, 36, {
      byteOffset: 8,
      target: 34962,
    });

    assert.equal(bufferView.byteLength, 36);
    assert.fail();
  });
});
