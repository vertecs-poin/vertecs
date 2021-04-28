import WebGpuSystem from "../systems/WebGpuSystem";
import { Accessor } from "../../gltf";
import { mat4 } from "gl-matrix";

export default class GpuBufferUtils {

  public static updateBufferFromMat4(source: mat4, destination: GPUBuffer, destinationOffset: number, byteCount: number) {
    const buffer = GpuBufferUtils.createFromFloat32Array(Float32Array.from(source), GPUBufferUsage.COPY_SRC);
    GpuBufferUtils.updateBuffer(buffer, destination, destinationOffset, byteCount);
  }

  public static updateBuffer(source: GPUBuffer, destination: GPUBuffer, destinationOffset: number, byteCount: number) {
    const encoder = WebGpuSystem.device.createCommandEncoder();
    encoder.copyBufferToBuffer(source, 0, destination, destinationOffset, byteCount);
    const commandBuffer = encoder.finish();
    const queue = WebGpuSystem.device.queue;
    queue.submit([commandBuffer]);
  }

  public static createFromFloat32Array(arrayBuffer: Float32Array, usage: GPUBufferUsageFlags): GPUBuffer {
    const buffer = WebGpuSystem.device.createBuffer({
      size: arrayBuffer.byteLength,
      usage: usage,
      mappedAtCreation: true
    });

    new Float32Array(buffer.getMappedRange()).set(arrayBuffer);
    buffer.unmap();

    return buffer;
  }

  /**
   * Create a buffer from an accessor
   * @param accessor The accessor to create a buffer from
   * @param usage The buffer usage
   */
  public static createFromAccessor(accessor: Accessor, usage: GPUBufferUsageFlags): GPUBuffer {
    let byteLength = accessor.getByteLength();
    if (byteLength % 4 !== 0) {
      byteLength = byteLength + byteLength % 4;
    }
    const buffer = WebGpuSystem.device.createBuffer({
      size: byteLength,
      usage: usage,
      mappedAtCreation: true
    });

    if (accessor.target === 34963) {
      new Int16Array(buffer.getMappedRange()).set(accessor.getDataAsInt16Array());
    } else {
      new Float32Array(buffer.getMappedRange()).set(accessor.getDataAsFloat32Array());
    }
    buffer.unmap();

    return buffer;
  }
}
