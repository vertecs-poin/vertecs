import LinearAnimationSampler from "./LinearAnimationSampler";
import AnimationSampler from "./AnimationSampler";
import { Accessor } from "../gltf";

export default class AnimationSamplerFactory {

  public static fromJson(json: any, accessors: Accessor[]): AnimationSampler {
    const input = accessors[json.input].getDataAsFloatArray();
    const output = accessors[json.output].getDataAsFloat32Array();
    switch (json.interpolation) {
      case "LINEAR": {
        return new LinearAnimationSampler(input, output);
      }
      default: {
        throw new Error(`Interpolation method unsupported: ${json.interpolation}`);
      }
    }
  }

  public static toJson(): any {

  }
}
