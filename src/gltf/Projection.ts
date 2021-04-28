import { mat4 } from 'gl-matrix';

export default class Projection {
  // TODO: Remove this class

  public static createDefaultPerspective(): mat4 {
    return mat4.perspective(mat4.create(), 80 * Math.PI / 180, 16 / 9.0, 0.01, -100);
  }

  public static createDefaultOrthographic(width: number, height: number): mat4 {
    return mat4.ortho(mat4.create(), -width, width, -height, height, 0.1, -100);
  }
}
