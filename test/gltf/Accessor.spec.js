var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { before } from 'mocha';
import { assert } from 'chai';
import { BufferView, Buffer, Accessor } from "../../src";
describe('Accessor', () => {
    let buffer;
    let indexBufferView;
    let positionBufferView;
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        buffer = yield Buffer.fromJson({
            uri: 'data:application/octet-stream;base64,AAABAAIAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAA=',
            byteLength: 44,
        });
        indexBufferView = new BufferView(buffer, 6, {
            byteOffset: 0,
            target: 34963,
        });
        positionBufferView = new BufferView(buffer, 36, {
            byteOffset: 8,
            target: 34962,
        });
    }));
    describe('Indices', () => {
        it('should have the correct indices', () => {
            const accessor = Accessor.fromJson({
                bufferView: 0,
                byteOffset: 0,
                componentType: 5123,
                count: 3,
                type: 'SCALAR',
                max: [2],
                min: [0],
            }, [indexBufferView]);
            const indices = accessor.getDataAsIntegerArray();
            assert.equal(accessor.getByteLength(), 6);
            assert.sameOrderedMembers(indices, [0, 1, 2]);
        });
    });
    describe('Positions', () => {
        it('should have the correct positions', () => {
            const accessor = Accessor.fromJson({
                bufferView: 0,
                byteOffset: 0,
                componentType: 5126,
                count: 3,
                type: 'VEC3',
                max: [1.0, 1.0, 0.0],
                min: [0.0, 0.0, 0.0],
            }, [positionBufferView]);
            const positions = accessor.getDataAsFloatArray();
            assert.equal(accessor.getByteLength(), 36);
            assert.sameOrderedMembers(positions, [0, 0, 0, 1, 0, 0, 0, 1, 0]);
        });
    });
});
//# sourceMappingURL=Accessor.spec.js.map