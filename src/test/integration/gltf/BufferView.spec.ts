import { assert } from "chai";
import { before } from "mocha";
import { Buffer, BufferView } from "../../../gltf";

describe("BufferView", () => {
  describe("Simple", () => {
    let buffer: Buffer;

    before(async () => {
      buffer = await Buffer.fromJson({
        uri: "data:application/octet-stream;base64,AAABAAIAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAA=",
        byteLength: 44
      });
    });

    it("should have the correct size and data", () => {
      const bufferView = BufferView.fromJson({
        "buffer": 0,
        "byteOffset": 0,
        "byteLength": 6,
        "target": 34963
      }, [buffer]);

      const result = Array.from(new Int16Array(bufferView.getArrayBuffer(2, 6, 0)));

      assert.equal(bufferView.byteLength, 6);
      assert.sameOrderedMembers(result, [0, 1, 2]);
    });

    it("should have the correct size and data", () => {
      const bufferView = BufferView.fromJson({
        "buffer": 0,
        "byteOffset": 8,
        "byteLength": 36,
        "target": 34962
      }, [buffer]);

      const result = Array.from(new Float32Array(bufferView.getArrayBuffer(3, 36, 0)));

      assert.equal(bufferView.byteLength, 36);
      assert.sameOrderedMembers(result, [0, 0, 0, 1, 0, 0, 0, 1, 0]);
    });
  });
});
