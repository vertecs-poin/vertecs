var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import simpleMaterial from "./simple_cameras.json";
import { assert } from "chai";
import { CameraComponent, GLTFFactory, Mesh, Transform } from "../../../../../src";
describe("Simple cameras", () => {
    let gltf;
    let scene;
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        gltf = yield GLTFFactory.fromJson(simpleMaterial);
        scene = gltf.children[0];
    }));
    it("should have 3 nodes", () => {
        const nodes = scene.children;
        assert.lengthOf(nodes, 3);
    });
    it("should have the correct mesh", () => {
        const node0 = scene.findChildByName("node0");
        const [transform, mesh] = node0.getComponents([Transform, Mesh]);
        assert.exists(node0);
        assert.exists(transform);
        assert.sameOrderedMembers(Array.from(transform.rotation), [-0.382999986410141, 0, 0, 0.9240000247955322]);
        assert.exists(mesh);
    });
    it("should have the correct first camera", () => {
        const node1 = scene.findChildByName("node1");
        const [transform, camera] = node1.getComponents([Transform, CameraComponent]);
        assert.exists(transform);
        assert.sameOrderedMembers(Array.from(transform.position), [0.5, 0.5, 3.0]);
        assert.exists(camera);
        assert.equal(camera.type, "perspective");
    });
    it("should have the correct second camera", () => {
        const node2 = scene.findChildByName("node2");
        const [transform, camera] = node2.getComponents([Transform, CameraComponent]);
        assert.exists(transform);
        assert.sameOrderedMembers(Array.from(transform.position), [0.5, 0.5, 3.0]);
        assert.exists(camera);
        assert.equal(camera.type, "orthographic");
    });
});
//# sourceMappingURL=SimpleCameras.spec.js.map