var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import simpleMeshes from "./simple_meshes.json";
import { assert } from "chai";
import { GLTFFactory, Mesh, Transform } from "../../../../../src";
import { mat4, vec3 } from "gl-matrix";
describe("Simple meshes", () => {
    let entity;
    let scene;
    let node0;
    let node1;
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        entity = (yield GLTFFactory.fromJson(simpleMeshes));
        scene = entity.findChildByName("scene");
        node0 = scene.findChildByName("node0");
        node1 = scene.findChildByName("node1");
    }));
    it("should have a scene with 2 nodes", () => {
        assert.exists(scene, "Scene not found");
        assert.lengthOf(scene === null || scene === void 0 ? void 0 : scene.children, 2);
    });
    it("should have the correct positions", () => {
        var _a, _b;
        const worldPositionNode0 = mat4.getTranslation(vec3.create(), (_a = node0 === null || node0 === void 0 ? void 0 : node0.getComponent(Transform)) === null || _a === void 0 ? void 0 : _a.getModelToWorldMatrix());
        const worldPositionNode1 = mat4.getTranslation(vec3.create(), (_b = node1 === null || node1 === void 0 ? void 0 : node1.getComponent(Transform)) === null || _b === void 0 ? void 0 : _b.getModelToWorldMatrix());
        assert.sameOrderedMembers(Array.from(worldPositionNode0), [0, 0, 0]);
        assert.sameOrderedMembers(Array.from(worldPositionNode1), [1, 0, 0]);
    });
    it("should have the same mesh", () => {
        const mesh0 = node0 === null || node0 === void 0 ? void 0 : node0.getComponent(Mesh);
        const mesh1 = node1 === null || node1 === void 0 ? void 0 : node1.getComponent(Mesh);
        assert.equal(mesh0 === null || mesh0 === void 0 ? void 0 : mesh0.id, mesh1 === null || mesh1 === void 0 ? void 0 : mesh1.id);
    });
});
//# sourceMappingURL=SimpleMeshes.spec.js.map