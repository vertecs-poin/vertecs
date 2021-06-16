import Component from "./Component";
import Entity from "./Entity";
import Performance from "../utils/Performance";

/**
 * TODO: Doc
 */
export default abstract class System<T extends any[] = []> {
  /**
   * A list of all the eligible entities
   */
  protected readonly $entities: Map<number, Entity>;

  /**
   * An array of components's types to filter entities
   * Only entities having the specified components will be eligible to this systems
   * @private
   */
  readonly #filter: T;

  /**
   * The number of tick per second, used for updating the system
   * @private
   */
  readonly #tps?: number;

  protected lastUpdate: number;

  /**
   * Create a new System
   * @param filter The components classes to make an entity eligible to this systems
   * @param tps The number of tick per second, used for updating the system
   */
  protected constructor(filter: Function[], tps?: number) {
    this.$entities = new Map();
    this.#filter = filter as T;
    this.lastUpdate = -1;
    this.#tps = tps;
  }

  /**
   * This method is called once after the system manager has been started
   * @protected
   */
  public abstract initialize(): Promise<void>;

  /**
   * This method is called before an entity is added to this systems
   * @param entity The eligible entity
   * @protected
   */
  protected onEligible(entity: Entity): void {

  }

  /**
   * Update a system, if a tps is specified, check that enough time has passed since
   * the last update
   */
  public update(): void {
    const timePassedSinceLastUpdate = Performance.now() - this.lastUpdate;
    if (!this.#tps || timePassedSinceLastUpdate > (1000 / this.#tps)) {
      const entities = Array.from(this.$entities.values()).map(entity => entity.getComponents(this.#filter));
      this.onUpdate(entities, timePassedSinceLastUpdate);
      this.lastUpdate = Performance.now();
    }
  };

  public abstract onUpdate(entities: any, timePassed: number): void;

  /**
   * Check if entity is eligible to this systems
   * @param components
   */
  public isEligible(components: Component[]): boolean {
    return this.#filter.every(filterComponent => components.find(component => component.constructor === filterComponent));
  }

  /**
   * Add an entity to the systems
   * @param entity
   * @param component The last added components
   */
  public addEntity(entity: Entity, component?: Component) {
    this.$entities.set(entity.id, entity);
    this.onEligible(entity);
  }

  /**
   * Remove an entity from the systems, this should only be done by the systems manager
   * @param entity
   */
  public removeEntity(entity: Entity) {
    this.$entities.delete(entity.id);
  }

  public get entities(): Map<number, Entity> {
    return this.$entities;
  }

  public get filter(): T {
    return this.#filter;
  }
}
