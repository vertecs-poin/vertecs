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
import { Buffer } from "../../../src/gltf";
describe("Buffer", () => {
    it("should load the data uri with the correct data", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            uri: "data:application/octet-stream;base64,AAABAAIAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAA=",
            byteLength: 44
        };
        const expectedResult = [
            0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128,
            63, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 63, 0, 0, 0, 0
        ];
        const buffer = yield Buffer.fromJson(data);
        const bufferView = new Int16Array(buffer.data);
        assert.equal(data.byteLength, 44);
        assert.sameOrderedMembers(Array.from(bufferView), expectedResult);
    }));
});
//# sourceMappingURL=Buffer.spec.js.map