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
import minimal from './minimal.json';
import { GLTF, Transform } from "../../src";
describe('GLTF minimal file', () => {
    let gltf;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const entity = yield GLTF.fromJson(minimal);
        if (!entity) {
            assert.fail('Failed to import minimal gltf file');
            throw new Error('Null entity');
        }
        gltf = entity;
    }));
    it('should have a single scene child', () => {
        assert.equal(gltf.children.length, 1);
    });
    it('should have the correct scene', () => {
        const scene = gltf.children[0];
        const transform = scene.getComponent(Transform);
        assert.equal(scene.name, 'test scene');
        assert.isNotNull(transform);
    });
    it('should have the correct node', () => {
        const scene = gltf.children[0];
        const mesh = scene.children[0];
        const transform = scene.getComponent(Transform);
        assert.isNotNull(transform);
        assert.equal(mesh.name, 'test node');
    });
    it('should have the correct mesh', () => {
        const scene = gltf.children[0];
        const node = scene.children[0];
        const mesh = node.children[0];
        const transform = scene.getComponent(Transform);
        assert.isNotNull(transform);
        assert.equal(mesh.name, 'test mesh');
    });
});
//# sourceMappingURL=Gltf.spec.js.map