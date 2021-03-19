import {assert} from 'chai';
import {before} from 'mocha';
import {Buffer, BufferView} from '../../src/gltf';

describe('BufferView', () => {
	let buffer: Buffer;

	before(async () => {
		buffer = await Buffer.fromJson({
			uri: 'data:application/octet-stream;base64,AAABAAIAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAA=',
			byteLength: 44
		});
	});

	it('should have the correct size and data', () => {
		const bufferView = new BufferView(buffer, 6, {
			byteOffset: 0,
			target: 34963
		});

		const result = Array.from(new Int16Array(bufferView.getArrayBuffer()));

		assert.equal(bufferView.byteLength, 6);
		assert.sameOrderedMembers(result, [0, 1, 2]);
	});

	it('should have the correct size and data', () => {
		const bufferView = new BufferView(buffer, 36, {
			byteOffset: 8,
			target: 34962
		});

		const result = Array.from(new Float32Array(bufferView.getArrayBuffer()));

		assert.equal(bufferView.byteLength, 36);
		assert.sameOrderedMembers(result, [0, 0, 0, 1, 0, 0, 0, 1, 0]);
	});
});
