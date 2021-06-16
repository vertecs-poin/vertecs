import { before } from "mocha";
import { assert } from "chai";
import interleaved from "./interleaved.json";
import { BufferView, Buffer, Accessor } from "../../../gltf";

describe("Accessor", () => {
  describe("Simple data", () => {
    let buffer: Buffer;
    let indexBufferView: BufferView;
    let positionBufferView: BufferView;

    before(async () => {
      buffer = await Buffer.fromJson({
        uri: "data:application/octet-stream;base64,AAABAAIAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAA=",
        byteLength: 44
      });
      indexBufferView = new BufferView(buffer, 6, {
        byteOffset: 0,
        target: 34963
      });
      positionBufferView = new BufferView(buffer, 36, {
        byteOffset: 8,
        target: 34962
      });
    });

    describe("Indices", () => {
      it("should have the correct indices", () => {
        const accessor = Accessor.fromJson({
          bufferView: 0,
          byteOffset: 0,
          componentType: 5123,
          count: 3,
          type: "SCALAR",
          max: [2],
          min: [0]
        }, [indexBufferView]);

        const indices = accessor.getDataAsIntArray();

        assert.equal(accessor.getByteLength(), 6);
        assert.sameOrderedMembers(indices, [0, 1, 2]);
      });
    });

    describe("Positions", () => {
      it("should have the correct positions", () => {
        const accessor = Accessor.fromJson({
          bufferView: 0,
          byteOffset: 0,
          componentType: 5126,
          count: 3,
          type: "VEC3",
          max: [1.0, 1.0, 0.0],
          min: [0.0, 0.0, 0.0]
        }, [positionBufferView]);

        const positions = accessor.getDataAsFloatArray();

        assert.equal(accessor.getByteLength(), 36);
        assert.sameOrderedMembers(positions, [0, 0, 0, 1, 0, 0, 0, 1, 0]);
      });
    });
  });

  describe("Interleaved data", () => {
    let buffer: Buffer;
    let bufferViews: BufferView[];

    before(async () => {
      buffer = await Buffer.fromJson(interleaved.buffers[0]);
      bufferViews = [
        BufferView.fromJson(interleaved.bufferViews[0], [buffer]),
        BufferView.fromJson(interleaved.bufferViews[1], [buffer])
      ];
    });

    describe("Indices", () => {
      it("should have the correct indices", () => {
        const indexAccessor = Accessor.fromJson(interleaved.accessors[0], bufferViews);

        const indices = indexAccessor.getDataAsIntArray();

        assert.equal(indexAccessor.getByteLength(), 12);
        assert.sameOrderedMembers(indices, [0, 1, 2, 1, 3, 2]);
      });
    });

    describe("Positions", () => {
      it("should have the correct positions", () => {
        const positionAccessor = Accessor.fromJson(interleaved.accessors[1], bufferViews);

        const positions = positionAccessor.getDataAsFloatArray();

        assert.equal(positionAccessor.getByteLength(), 48);
        assert.sameOrderedMembers(positions, [
          0, 0, 0,
          1, 0, 0,
          0, 1, 0,
          1, 1, 0
        ]);
      });
    });

    describe("Texture coordinates", () => {
      it("should have the correct texture coordinates", () => {
        const textureCoordinateAccessor = Accessor.fromJson(interleaved.accessors[2], bufferViews);

        const textureCoordinates = textureCoordinateAccessor.getDataAsFloatArray();

        assert.equal(textureCoordinateAccessor.getByteLength(), 32);
        assert.sameOrderedMembers(textureCoordinates, [
          0, 1,
          1, 1,
          0, 0,
          1, 0
        ]);
      });
    });
  });
});
