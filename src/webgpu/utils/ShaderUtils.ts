import { Primitive } from "../../gltf";

export default class ShaderUtils {
  private static readonly DEFAULT_DEFINITIONS: string[] = [];

  /**
   * Return a list of definitions needed from a primitive
   */
  public static getDefinitionsFromPrimitive(primitive: Primitive) {
    const definitions: string[] = [];
    definitions.push(...ShaderUtils.DEFAULT_DEFINITIONS);

    if (primitive.material.pbrMetallicRoughness.baseColorTextureInfo) {
      definitions.push("HAS_BASE_COLOR_TEXTURE");
    }

    return definitions;
  }
}
