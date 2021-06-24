import { mat4, quat, vec3 } from "gl-matrix";
import { Entity } from "../../ecs";
import Component from "../../ecs/Component";

/**
 * A transform represents a position, rotation and a scale, it may have a parent Transform,
 *
 * Global position, rotation and scale are only updated when dirty and queried,
 * parents are updated from the current transform up to the root transform.
 */
export default class Transform extends Component {
  /**
   * The result of the post-multiplication of all the parents of this transform
   * This matrix is only updated when queried and dirty
   * @private
   */
  readonly #modelToWorldMatrix: mat4;

  /**
   * The inverse of {@see modelToWorldMatrix}
   * This matrix is only updated when queried and dirty
   * @private
   */
  readonly #worldToModelMatrix: mat4;

  /**
   * The result of Translation * Rotation * Scale
   * This matrix is only updated when queried and dirty
   * @private
   */
  readonly #modelMatrix: mat4;

  /**
   * The current position
   * @private
   */
  readonly #position: vec3;

  /**
   * The current rotation
   * @private
   */
  readonly #rotation: quat;

  /**
   * The current scale
   * @private
   */
  readonly #scaling: vec3;

  #dirty: boolean;

  /**
   * The parent transform
   * @private
   */
  #parent?: Transform;

  /**
   * Creates a new transform
   * @param parent The parent transform
   * @param translation Specifies the translation, will be copied using {@link vec3.copy}
   * @param rotation Specifies the rotation, will be copied using {@link quat.copy}
   * @param scaling Specifies the scale, will be copied using {@link vec3.copy}
   */
  public constructor(parent?: Transform, translation?: vec3, rotation?: quat, scaling?: vec3) {
    super();

    this.#parent = parent;
    this.#modelMatrix = mat4.create();
    this.#modelToWorldMatrix = mat4.create();
    this.#worldToModelMatrix = mat4.create();
    this.#position = vec3.create();
    this.#rotation = quat.create();
    this.#scaling = vec3.fromValues(1, 1, 1);

    if (translation) vec3.copy(this.#position, translation);
    if (rotation) quat.copy(this.#rotation, rotation);
    if (scaling) vec3.copy(this.#scaling, scaling);

    this.#dirty = true;
  }

  /**
   * Set this transform's parent to the entity's parent
   * @param entity The entity this transform is attached to
   */
  public onAddedToEntity(entity: Entity) {
    this.#parent = entity.parent?.getComponent(Transform);
  }

  /**
   * Update this transform's parent
   * @param entity The entity with a new parents
   */
  public onEntityParentChange(entity: Entity) {
    this.#parent = entity.parent?.getComponent(Transform);
  }

  public static fromMat4(matrix: mat4): Transform {
    const transform = new Transform();
    transform.copy(matrix);
    return transform;
  }

  /**
   * Copy the translation, rotation and scaling of the transform
   * @param transform The transform to copy from
   */
  public copy(transform: mat4) {
    mat4.getTranslation(this.#position, transform);
    mat4.getRotation(this.#rotation, transform);
    mat4.getScaling(this.#scaling, transform);
    this.#dirty = true;
  }

  /**
   * Translate this transform using a translation vector
   * @param translation The translation vector
   */
  public translate(translation: vec3): void {
    vec3.add(this.#position, this.#position, translation);
    this.#dirty = true;
  }

  public setPosition(translation: vec3): void {
    vec3.copy(this.#position, translation);
    this.#dirty = true;
  }

  public setWorldPosition(target: vec3): void {
    const worldToModel = mat4.clone(this.getWorldToModelMatrix());
    worldToModel[12] = 0;
    worldToModel[13] = 0;
    worldToModel[14] = 0;
    const result = vec3.transformMat4(vec3.create(), target, worldToModel);
    this.setPosition(result);
  }

  public setWorldPositionXYZ(x: number, y: number, z: number): void {
    this.setWorldPosition([x, y, z]);
  }

  public setWorldRotation(rotation: quat): void {
    // TODO: Cache this
    const worldRotation = mat4.getRotation(quat.create(), this.getModelToWorldMatrix());
    // TODO: Cache this
    const inverseWorldRotation = quat.invert(quat.create(), worldRotation);
    quat.mul(inverseWorldRotation, inverseWorldRotation, rotation);
    this.rotate(inverseWorldRotation);
  }

  /**
   * Reset to default values
   */
  public reset(): void {
    vec3.set(this.#position, 0, 0, 0);
    quat.set(this.#rotation, 0, 0, 0, 1);
    vec3.set(this.#scaling, 1, 1, 1);
    this.#dirty = true;
  }

  public rotateXYZ(x: number, y: number, z: number): void {
    this.rotateX(x);
    this.rotateY(y);
    this.rotateZ(z);
  }

  /**
   * Rotate this transform in the x axis
   * @param x An angle in radians
   */
  public rotateX(x: number): void {
    quat.rotateX(this.#rotation, quat.create(), x);
    this.#dirty = true;
  }

  public rotateY(y: number): void {
    quat.rotateY(this.#rotation, quat.create(), y);
    this.#dirty = true;
  }

  public rotateZ(z: number): void {
    quat.rotateZ(this.#rotation, quat.create(), z);
    this.#dirty = true;
  }

  public rotate(rotation: quat): void {
    quat.mul(this.#rotation, this.#rotation, rotation);
    this.#dirty = true;
  }

  public scaleXYZ(x: number, y: number, z: number): void {
    vec3.mul(this.#scaling, this.#scaling, [x, y, z]);
    this.#dirty = true;
  }

  public setWorldScale(scale: vec3): void {
    const inverseScale = mat4.getScaling(vec3.create(), this.getWorldToModelMatrix());
    this.setScale(vec3.mul(inverseScale, inverseScale, scale));
  }

  public scale(scale: vec3): void {
    vec3.multiply(this.#scaling, this.#scaling, scale);
    this.#dirty = true;
  }

  public setScale(scale: vec3) {
    vec3.copy(this.#scaling, scale);
    this.#dirty = true;
  }

  public setRotationXYZ(x: number, y: number, z: number): void {
    quat.identity(this.#rotation);
    quat.fromEuler(this.#rotation, x, y, z);
    this.#dirty = true;
  }

  public setRotationXYZW(x: number, y: number, z: number, w: number): void {
    quat.set(this.#rotation, x, y, z, w);
    this.#dirty = true;
  }

  public setRotationQuat(rotation: quat): void {
    quat.copy(this.rotation, rotation);
    this.#dirty = true;
  }

  // TODO: Change name to update
  /**
   * Get the model to world matrix of this transform and updates it
   * It update all the parents until no one is dirty
   */
  public getModelToWorldMatrix(): mat4 {
    if (this.#dirty) {
      // Update the model matrix
      mat4.fromRotationTranslationScale(
        this.#modelMatrix,
        this.#rotation, this.#position, this.#scaling
      );
      if (this.#parent) {
        // Post multiply the model to world matrix with the parent model to world matrix
        this.#parent.getModelToWorldMatrix();
        mat4.mul(this.#modelToWorldMatrix, this.#parent?.getModelToWorldMatrix(), this.#modelMatrix);
      } else {
        mat4.copy(this.#modelToWorldMatrix, this.#modelMatrix);
      }
    }
    return this.#modelToWorldMatrix;
  }

  public getWorldToModelMatrix(): mat4 {
    return mat4.invert(this.#worldToModelMatrix, this.getModelToWorldMatrix());
  }

  /**
   * Get the world position of this transform
   * @param out The world position
   */
  public getWorldPosition(out: vec3): vec3 {
    return mat4.getTranslation(out, this.getModelToWorldMatrix());
  }

  public getWorldScale(out: vec3): vec3 {
    return mat4.getScaling(out, this.getModelToWorldMatrix());
  }

  public getWorldRotation(out: quat): quat {
    return mat4.getRotation(out, this.getModelToWorldMatrix());
  }

  public toWorldPosition(out: vec3, position: vec3) {
    vec3.transformMat4(out, position, this.getModelToWorldMatrix());
  }

  public cameraLookAtXYZ(out: vec3, x: number, y: number, z: number) {
    const lookAt = mat4.lookAt(mat4.create(), this.getWorldPosition(out), [x, y, z], [0, 1, 0]);
    mat4.getRotation(this.#rotation, lookAt);
    this.#dirty = true;
  }

  public lookAtXYZ(out: vec3, x: number, y: number, z: number) {
    const lookAt = mat4.lookAt(mat4.create(), this.getWorldPosition(out), [x, y, z], [0, 1, 0]);
    mat4.getRotation(this.#rotation, lookAt);
    this.#dirty = true;
  }

  public setWorldUnitScale(): void {
    const modelToWorldMatrix = this.getModelToWorldMatrix();

    const scale = vec3.create(); // TODO: Cache this
    const currentScale = vec3.create(); // TODO: Cache this
    vec3.div(scale, [1, 1, 1], mat4.getScaling(currentScale, modelToWorldMatrix));

    this.scale(scale);
  }

  public get parent(): Transform | undefined {
    return this.#parent;
  }

  /**
   * Get the current position
   */
  public get position(): vec3 {
    return this.#position;
  }

  /**
   * Set the current position
   * @param position Specifies the new position, will be copied using {@link vec3.copy}
   */
  public set position(position: vec3) {
    vec3.copy(this.#position, position);
    this.#dirty = true;
  }

  /**
   * Get the current scale
   */
  public get scaling(): vec3 {
    return this.#scaling;
  }

  /**
   * Get the current rotation
   */
  public get rotation(): quat {
    return this.#rotation;
  }

  /**
   * Return a new Transform with the same position, rotation, scaling, but no parent
   */
  public clone(): Component {
    return new Transform(undefined, this.#position, this.#rotation, this.#scaling);
  }
}
