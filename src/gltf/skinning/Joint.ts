import { mat4 } from 'gl-matrix';
import Component from '../../ecs/Component';

export default class Joint extends Component {
  private readonly inverseBindMatrix: mat4;

  public constructor(inverseBindMatrix: mat4) {
    super();

    this.inverseBindMatrix = inverseBindMatrix;
  }

  public static fromJson(inverseBindMatrix: any): Joint {
    return new Joint(inverseBindMatrix);
  }

  public updateJointMatrix(out: mat4, skinMatrix: mat4, jointMatrix: mat4, skeletonMatrix: mat4) {
    mat4.invert(out, skinMatrix);
    mat4.mul(out, out, jointMatrix);
    mat4.mul(out, out, this.inverseBindMatrix);
  }

  public clone(): Component {
    return this;
  }
}
