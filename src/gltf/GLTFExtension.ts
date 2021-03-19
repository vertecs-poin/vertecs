import Material from './Material';
import Primitive from './Primitive';
import Sampler from './Sampler';
import Texture from './Texture';
import { TextureInfo } from './TextureInfo';
import Buffer from './Buffer';
import Entity from '../ecs/Entity';
import CameraLens from './CameraLens';
import BufferView from './BufferView';
import Accessor from './Accessor';

export default abstract class GLTFExtension {
  private name: string;

  protected constructor(name: string) {
    this.name = name;
  }

  /** Extension loaders * */

  /**
   * This method is called to load extension top-level data
   * @param json The extension data
   */
  public importExtension(json: any): void {}

  public importNode(node: Entity, json: any): void {}

  public importMaterial(node: Entity, material: Material, json: any): void {}

  public importPrimitive(node: Entity, primitive: Primitive, json: any): void {}

  public importCameraLens(node: Entity, cameraLens: CameraLens, json: any): void {}

  public importScene(node: Entity, json: any): void {}

  public importBuffer(buffer: Buffer, json: any): void {}

  public importBufferView(bufferView: BufferView, json: any): void {}

  /** Extension exporters * */

  public exportExtension(): any {}

  public exportNode(node: Entity): any {}

  public exportMesh(mesh: Entity): any {}

  public exportMaterial(node: Entity, material: Material): any {}

  public exportPrimitive(node: Entity, primitive: Primitive): any {}

  public exportCameraLens(node: Entity, cameraLens: CameraLens): any {}

  public exportScene(scene: Entity): any {}

  public exportBuffer(buffer: Buffer): any {}

  public exportBufferView(bufferView: BufferView): any {}

  public exportAccessor(accessor: Accessor): any {}

  public exportSampler(sampler: Sampler): any {}

  public exportTexture(texture: Texture): any {}

  public exportTextureInfo(textureInfo: TextureInfo): any {}

  public get $name(): string {
    return this.name;
  }

  public set $name(value: string) {
    this.name = value;
  }
}
