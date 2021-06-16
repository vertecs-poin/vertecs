import { Primitive } from "../../gltf";

export default class ShaderUtils {
  private static readonly DEFAULT_DEFINITIONS: string[] = [];

  /**
   * Return a list of definitions needed from a primitive
   */
  public static getDefinitionsFromPrimitive(primitive: Primitive): string[] {
    const definitions = [];
    // definitions.push("DEBUG_JOINTS_0");
    // definitions.push("DEBUG_WEIGHTS_0");

    definitions.push(...ShaderUtils.DEFAULT_DEFINITIONS);

    if (primitive.material.pbrMetallicRoughness.baseColorTextureInfo) {
      definitions.push("HAS_BASE_COLOR_TEXTURE");
    }

    if (primitive.attributes.get("WEIGHTS_0")) {
      definitions.push("IS_RIGGED");
    }

    if (primitive.attributes.get("COLOR_0")) {
      definitions.push("HAS_COLOR");
    }

    return definitions;
  }
}
