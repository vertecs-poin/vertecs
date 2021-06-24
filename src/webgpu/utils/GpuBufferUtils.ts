import { Accessor } from "../../gltf";
import { mat4 } from "gl-matrix";
import WebGpuSystem from "../render/systems/WebGpuSystem";

export default class GpuBufferUtils {

  /**
   * Update a WebGPU buffer from a mat4
   * @param source The mat4 to send to buffer
   * @param destination The buffer to update, must have a size of 64 bytes or more
   * @param destinationOffset The buffer's offset
   */
  public static updateBufferFromMat4(source: mat4, destination: GPUBuffer, destinationOffset: number): void {
    const buffer = GpuBufferUtils.createFromFloat32Array(Float32Array.from(source), GPUBufferUsage.COPY_SRC);
    GpuBufferUtils.updateBuffer(buffer, destination, destinationOffset, 64);
    buffer.destroy();
  }

  public static updateBuffer(source: GPUBuffer, destination: GPUBuffer, destinationOffset: number, byteCount: number): void {
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
   * @param label The label of the buffer
   * @param accessor The accessor to create a buffer from
   * @param usage The buffer usage
   */
  public static async createFromAccessor(label: string, accessor: Accessor, usage: GPUBufferUsageFlags): Promise<GPUBuffer> {
    let byteLength = accessor.getByteLength();
    if (byteLength % 4 !== 0) {
      // align size to 4
      byteLength = byteLength + (4 - byteLength % 4);
    }

    // WebGPU index buffer only supports 16 and 32 bits indexes
    // Transform all 8bits integer buffer into 16bits buffers
    if (usage === GPUBufferUsage.INDEX && accessor.getComponentTypeByteSize() === 1) {
      byteLength *= 2;
    }

    const descriptor = {
      label,
      size: byteLength,
      usage: usage,
      mappedAtCreation: true
    };
    const buffer = WebGpuSystem.device.createBuffer(descriptor);

    const data = accessor.getData();
    switch (accessor.componentType) {
      // Unsigned byte
      case 5121: {
        // WebGPU index buffer only supports 16 and 32 bits indexes
        // Return a 16bits array instead
        if (usage === GPUBufferUsage.INDEX) {
          const dataAsUint16Array = accessor.getDataAsInt8Array();
          new Uint16Array(buffer.getMappedRange()).set(new Uint16Array(dataAsUint16Array));
        } else {
          new Uint8Array(buffer.getMappedRange()).set(new Uint8Array(data));
        }
        break;
      }
      // Unsigned short
      case 5123:
        new Uint16Array(buffer.getMappedRange()).set(new Uint16Array(data));
        break;
      // Unsigned int
      case 5125:
        new Uint32Array(buffer.getMappedRange()).set(new Uint32Array(data));
        break;
      case 5126:
        // Float
        new Float32Array(buffer.getMappedRange()).set(new Float32Array(data));
        break;
      default:
        throw new Error("Accessor's component type not supported: " + accessor.componentType);
    }
    buffer.unmap();

    return buffer;
  }
}
