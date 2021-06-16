import Entity from "./Entity";

export default abstract class Component {
  public static LAST_ID = 0;

  readonly #id: number;

  constructor() {
    this.#id = Component.LAST_ID++;
  }

  /**
   * This method is called once added to an entity
   * It may be called multiple times per instance for different entities
   * @param entity The entity this components was added to
   */
  public onAddedToEntity(entity: Entity): void {
  }

  /**
   * This method is called once the entity has a new parent
   * @param entity The entity with a new parent
   */
  public onEntityParentChange(entity: Entity): void {
  }

  /**
   * This method is called once removed from an entity
   * It may be called multiple times per instance for different entities
   * @param entity The entity this components was removed from
   */
  public onRemovedFromEntity(entity: Entity): void {
  }

  /**
   * This method is called once destroyed
   */
  public onDestroyed(): void {

  }

  /**
   * Return a clone of this components
   */
  public clone(): Component {
    throw new Error("Not implemented yet.");
  }

  public get id(): number {
    return this.#id;
  }
}
