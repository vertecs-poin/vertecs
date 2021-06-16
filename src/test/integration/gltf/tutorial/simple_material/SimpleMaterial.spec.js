var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import simpleMaterial from "./simple_material.json";
import { assert } from "chai";
import { GLTFFactory, Mesh } from "../../../../../src";
describe("Simple material", () => {
    let entity;
    let scene;
    let mesh;
    let primitive;
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        entity = (yield GLTFFactory.fromJson(simpleMaterial));
        scene = entity.findChildByName("scene");
    }));
    it("should have a mesh with one primitive", () => {
        const node = scene.children[0];
        mesh = node.getComponent(Mesh);
        assert.isDefined(mesh);
        assert.lengthOf(mesh.primitives, 1);
    });
    it("should have a material with the correct color", () => {
        primitive = mesh.primitives[0];
        const pbrMetallicRoughness = primitive.material.pbrMetallicRoughness;
        assert.sameOrderedMembers(Array.from(pbrMetallicRoughness.baseColorFactor), [1.000, 0.766, 0.336, 1.0]);
        assert.equal(pbrMetallicRoughness.metallicFactor, 0.5);
        assert.equal(pbrMetallicRoughness.roughnessFactor, 0.1);
    });
});
//# sourceMappingURL=SimpleMaterial.spec.js.map