import { Material } from "../../gltf";
import GpuBufferUtils from "../utils/GpuBufferUtils";

export default class MaterialView {

  public static toBuffer(material: Material): GPUBuffer {
    const float32Array = new Float32Array(8);
    float32Array.set(material.pbrMetallicRoughness.baseColorFactor, 0);
    float32Array.set([
      material.pbrMetallicRoughness.metallicFactor,
      material.pbrMetallicRoughness.roughnessFactor,
      material.alphaMode,
      material.alphaCutOff
    ], 4);

    return GpuBufferUtils.createFromFloat32Array(
      float32Array,
      GPUBufferUsage.UNIFORM
    );
  }
}
