import { Entity, System } from "../../../ecs";
import LightSource from "../components/LightSource";
import AmbientLight from "../components/AmbientLight";
import PointLight from "../components/PointLight";
import GpuBufferUtils from "../../utils/GpuBufferUtils";
import WebGpuSystem from "../../render/systems/WebGpuSystem";
import DirectionalLight from "../components/DirectionalLight";
import SpotLight from "../components/SpotLight";
import { Transform } from "../../../math";

export default class LightSystem extends System<[PointLight, Transform]> {
  public static readonly MAX_AMBIENT_LIGHTS = 1;
  public static readonly MAX_POINT_LIGHTS = 1;
  public static readonly MAX_DIRECTIONAL_LIGHTS = 1;
  public static readonly MAX_SPOT_LIGHTS = 1;

  public static readonly AMBIENT_LIGHTS_BYTE_SIZE = LightSystem.MAX_AMBIENT_LIGHTS * AmbientLight.BYTE_SIZE;
  public static readonly POINT_LIGHTS_BYTE_SIZE = LightSystem.MAX_POINT_LIGHTS * PointLight.BYTE_SIZE;
  public static readonly DIRECTIONAL_LIGHTS_BYTE_SIZE = LightSystem.MAX_DIRECTIONAL_LIGHTS * DirectionalLight.BYTE_SIZE;
  public static readonly SPOT_LIGHTS_BYTE_SIZE = LightSystem.MAX_SPOT_LIGHTS * SpotLight.BYTE_SIZE;

  public static readonly MAX_BYTE_SIZE = 16 +
    LightSystem.AMBIENT_LIGHTS_BYTE_SIZE +
    LightSystem.POINT_LIGHTS_BYTE_SIZE +
    LightSystem.DIRECTIONAL_LIGHTS_BYTE_SIZE +
    LightSystem.SPOT_LIGHTS_BYTE_SIZE;

  private ambientLights: AmbientLight[];
  private pointLights: PointLight[];
  private directionalLights: DirectionalLight[];

  readonly #data: ArrayBuffer;

  public constructor(tps?: number) {
    super([PointLight, Transform], tps);
    this.ambientLights = [];
    this.pointLights = [];
    this.directionalLights = [];
    this.#data = new ArrayBuffer(LightSystem.MAX_BYTE_SIZE);
  }

  public async initialize(): Promise<void> {

  }

  protected onEligible(entity: Entity) {
    console.debug(entity);
  }

  public onUpdate(entities: [PointLight, Transform][], timePassed: number): void {
    // let ambientLightIndex = 0;
    // let pointLightIndex = 0;
    //
    // entities.forEach(([lightSource, transform]) => {
    //   if (lightSource instanceof AmbientLight) {
    //     const offset = 16 + ambientLightIndex++ * AmbientLight.BYTE_SIZE;
    //     new Float32Array(this.#data).set(new Float32Array(lightSource.data), offset / 4);
    //   } else if (lightSource instanceof PointLight) {
    //     lightSource.update(transform);
    //     const offset = 16 + LightSystem.AMBIENT_LIGHTS_BYTE_SIZE + pointLightIndex++ * PointLight.BYTE_SIZE;
    //     console.debug(offset);
    //     console.debug(new Float32Array(this.#data));
    //     new Float32Array(this.#data).set(new Float32Array(lightSource.data), offset / 4);
    //     console.debug(new Float32Array(this.#data));
    //   }
    // });
    //
    // const metadata = new Int32Array(this.#data);
    // metadata.set([ambientLightIndex, pointLightIndex, 0, 0], 0);
    //
    // const float32Array = new Float32Array(this.#data);
    // const buffer = GpuBufferUtils.createFromFloat32Array(float32Array, GPUBufferUsage.COPY_SRC);
    // GpuBufferUtils.updateBuffer(buffer, WebGpuSystem.lightSceneBuffer, 0, LightSystem.MAX_BYTE_SIZE);
    // buffer.destroy();
  }
}
