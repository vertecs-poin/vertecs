var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import simpleMeshes from "./simple_texture.json";
import { assert } from "chai";
import Entity from "../../../../../src/ecs/Entity";
import GLTFFactory from "../../../../../src/gltf/GltfFactory";
import Material from "../../../../../src/gltf/Material";
describe("Simple texture", () => {
    let gltf;
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        gltf = (_a = yield GLTFFactory.fromJson(simpleMeshes)) !== null && _a !== void 0 ? _a : new Entity();
    }));
    it("should have the correct pbr material", () => {
        const mesh = gltf === null || gltf === void 0 ? void 0 : gltf.findChildByName("node0");
        const material = mesh === null || mesh === void 0 ? void 0 : mesh.getComponent(Material);
        assert.exists(mesh);
        assert.exists(material);
        assert.equal(material.pbrMetallicRoughness.metallicFactor, 0.0);
        assert.equal(material.pbrMetallicRoughness.roughnessFactor, 1.0);
        assert.exists(material.pbrMetallicRoughness.baseColorTextureInfo);
    });
});
//# sourceMappingURL=SimpleTexture.spec.js.map
