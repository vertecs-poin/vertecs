import { GLTFOptions } from "./GLTFFactory";

export default class GLTFObject {
  /**
   * The user-defined name of this object.
   * @private
   */
  #name?: string;

  #extensions?: object;

  #extras?: any;

  public constructor(options?: GLTFOptions) {
    this.#name = options?.name;
    this.#extensions = options?.extensions;
    this.#extras = options?.extras;
  }

  public get name(): string | undefined {
    return this.#name;
  }

  public set name(value: string | undefined) {
    this.#name = value;
  }

  public get extensions(): object | undefined {
    return this.#extensions;
  }

  public set extensions(value: object | undefined) {
    this.#extensions = value;
  }

  public get extras(): any {
    return this.#extras;
  }

  public set extras(value: any) {
    this.#extras = value;
  }
}
