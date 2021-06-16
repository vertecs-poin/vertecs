var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { assert } from "chai";
import { before } from "mocha";
import { BufferView, Buffer } from "../../../src";
describe("BufferView", () => {
    describe("Simple", () => {
        let buffer;
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            buffer = yield Buffer.fromJson({
                uri: "data:application/octet-stream;base64,AAABAAIAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAA=",
                byteLength: 44
            });
        }));
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
//# sourceMappingURL=BufferView.spec.js.map