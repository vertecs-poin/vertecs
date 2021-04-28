import GLTFObject from "./GLTFObject";
import GLTFExtension from "./GLTFExtension";
import { GLTFOptions } from "./GLTFFactory";

type SamplerOptions = GLTFOptions & {
  magFilter: number,
  minFilter: number,
  wrapS: number,
  wrapT: number,
}

export default class Sampler extends GLTFObject {
  #magFilter: number;

  #minFilter: number;

  #wrapS: number;

  #wrapT: number;

  constructor(options?: SamplerOptions) {
    super(options);

    this.#magFilter = options?.magFilter ?? -1;
    this.#minFilter = options?.minFilter ?? -1;
    this.#wrapS = options?.wrapS ?? 10497;
    this.#wrapT = options?.wrapT ?? 10497;
  }

  public static toJSON(sampler: Sampler, extensions?: GLTFExtension[]): any {
    return {
      magFilter: sampler.magFilter,
      minFilter: sampler.minFilter,
      wrapS: sampler.wrapS,
      wrapT: sampler.wrapT,
      name: sampler.name,
      extensions: extensions?.map(extension => extension.exportSampler(sampler))
    };
  }

  public get magFilter(): number {
    return this.#magFilter;
  }

  public set magFilter(value: number) {
    this.#magFilter = value;
  }

  public get minFilter(): number {
    return this.#minFilter;
  }

  public set minFilter(value: number) {
    this.#minFilter = value;
  }

  public get wrapS(): number {
    return this.#wrapS;
  }

  public set wrapS(value: number) {
    this.#wrapS = value;
  }

  public get wrapT(): number {
    return this.#wrapT;
  }

  public set wrapT(value: number) {
    this.#wrapT = value;
  }
}