import { mat4 } from "gl-matrix";
import Component from "../../ecs/Component";
import { Transform } from "../../math";
import { Skin } from "./Skin";

export class Joint extends Component {
  readonly #index: number;
  readonly #transformOfNodeThatTheMeshIsAttachedTo: Transform;
  readonly #inverseBindMatrix: mat4;
  readonly #skin: Skin;

  public constructor(index: number, skin: Skin, inverseBindMatrix: mat4, transformOfNodeThatTheMeshIsAttachedTo: Transform) {
    super();
    this.#index = index;
    this.#transformOfNodeThatTheMeshIsAttachedTo = transformOfNodeThatTheMeshIsAttachedTo;
    this.#inverseBindMatrix = inverseBindMatrix;
    this.#skin = skin;
  }

  public updateJointMatrix(jointGlobalTransform: mat4): void {
    const result = mat4.create();
    mat4.mul(result, result, this.#transformOfNodeThatTheMeshIsAttachedTo.getWorldToModelMatrix());
    mat4.mul(result, result, jointGlobalTransform);
    mat4.mul(result, result, this.#inverseBindMatrix);
    this.#skin.matrices[this.#index] = result;
  }
}
