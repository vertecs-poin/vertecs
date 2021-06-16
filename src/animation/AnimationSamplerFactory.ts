import LinearAnimationSampler from "./LinearAnimationSampler";
import AnimationSampler from "./AnimationSampler";
import { Accessor } from "../gltf";

export interface AnimationSamplerJson {
  input: number;
  output: number;
  interpolation: string;
}

export default class AnimationSamplerFactory {

  public static fromJson(json: AnimationSamplerJson, accessors: Accessor[]): AnimationSampler {
    const input = accessors[json.input].getDataAsFloatArray();
    const output = accessors[json.output].getDataAsFloat32Array();
    switch (json.interpolation) {
      case "LINEAR": {
        return new LinearAnimationSampler(input, output);
      }
      default: {
        return new LinearAnimationSampler(input, output);
      }
    }
  }

  public static toJson(): AnimationSamplerJson {
    return {
      input: 0,
      output: 0,
      interpolation: "LINEAR"
    };
  }
}
