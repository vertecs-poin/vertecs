var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { assert } from 'chai';
import { before } from 'mocha';
import { BufferView, Buffer } from "../../src";
describe('BufferView', () => {
    let buffer;
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        buffer = yield Buffer.fromJson({
            uri: 'data:application/octet-stream;base64,AAABAAIAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAA=',
            byteLength: 44,
        });
    }));
    it('should have the correct size', () => {
        const bufferView = new BufferView(buffer, 6, {
            byteOffset: 0,
            target: 34963,
        });
        assert.equal(bufferView.byteLength, 6);
    });
    it('should have the correct size', () => {
        const bufferView = new BufferView(buffer, 36, {
            byteOffset: 8,
            target: 34962,
        });
        assert.equal(bufferView.byteLength, 36);
    });
});
//# sourceMappingURL=BufferView.spec.js.map