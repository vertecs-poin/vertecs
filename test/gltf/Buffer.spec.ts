import { Buffer } from '../../src';
import { assert } from 'chai';

describe('Buffer', () => {
  it('should load the data uri with the correct data', async () => {
    const data = {
      uri: 'data:application/octet-stream;base64,AAABAAIAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAA=',
      byteLength: 44,
    };
    const expectedResult = [
      0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128,
      63, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 63, 0, 0, 0, 0,
    ];

    const buffer = await Buffer.fromJson(data);

    const bufferView = new Int16Array(buffer.data);

    assert.equal(data.byteLength, 44);
    assert.sameOrderedMembers(Array.from(bufferView), expectedResult);
  });

  it('should load the data uri from a specified file', async () => {
    assert.fail('TODO');
  });
});
