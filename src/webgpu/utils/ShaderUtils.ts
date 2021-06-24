import { Primitive } from "../../gltf";

export default class ShaderUtils {
  private static readonly DEFAULT_DEFINITIONS: string[] = [];

  /**
   * Return a list of definitions needed from a primitive
   */
  public static getDefinitionsFromPrimitive(primitive: Primitive): string[] {
    const definitions = [];

    definitions.push(...ShaderUtils.DEFAULT_DEFINITIONS);

    if (primitive.material.pbrMetallicRoughness.baseColorTextureInfo) {
      definitions.push("HAS_BASE_COLOR_TEXTURE");
    }

    // TODO: Refactor using a map
    if (primitive.attributes.get("WEIGHTS_0")) {
      definitions.push("IS_RIGGED");
    }

    if (primitive.attributes.get("NORMAL")) {
      // definitions.push("USE_LIGHTING");
      // definitions.push("HAS_NORMAL");
    }

    if (primitive.attributes.get("COLOR_0")) {
      definitions.push("HAS_COLOR");
    }

    if (primitive.attributes.get("XZ")) {
      definitions.push("IS_TERRAIN");
    }

    return definitions;
  }
}
