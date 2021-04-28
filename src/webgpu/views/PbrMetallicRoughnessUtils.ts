import { PbrMetallicRoughness } from "../../gltf";
import GpuBufferUtils from "../utils/GpuBufferUtils";

export default class PbrMetallicRoughnessUtils {

  public static toBuffer(pbrMetallicRoughness: PbrMetallicRoughness): GPUBuffer {
    const float32Array = new Float32Array(32);
    float32Array.set(pbrMetallicRoughness.baseColorFactor, 0);
    return GpuBufferUtils.createFromFloat32Array(
      Float32Array.from(float32Array),
      GPUBufferUsage.UNIFORM
    );
  }
}
