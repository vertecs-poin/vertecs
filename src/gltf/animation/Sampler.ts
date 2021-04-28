import Accessor from '../Accessor';

export default class Sampler {
  #input: number[];

  #interpolation: string;

  #output: number[];

  public constructor(input: number[], output: number[], interpolation?: string) {
    this.#input = input;
    this.#output = output;
    this.#interpolation = interpolation ?? 'LINEAR';
  }

  public get input(): number[] {
    return this.#input;
  }

  public get interpolation(): string {
    return this.#interpolation;
  }

  public get output(): number[] {
    return this.#output;
  }

  public set input(value: number[]) {
    this.#input = value;
  }

  public set interpolation(value: string) {
    this.#interpolation = value;
  }

  public set output(value: number[]) {
    this.#output = value;
  }
}
