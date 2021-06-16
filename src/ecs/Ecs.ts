import Entity, { ComponentConstructor } from "./Entity";
import System from "./System";
import Performance from "../utils/Performance";
import Component from "./Component";

/**
 * A singleton systems manager
 */
export default class Ecs {
  public static readonly systems: System<[ComponentConstructor<Component>]>[] = [];

  /**
   * Last call to the update method
   * @private
   */
  static lastUpdate: number;

  public constructor() {
    Ecs.lastUpdate = -1;
  }

  public static start() {
    requestAnimationFrame(Ecs.loop);
  }

  public static loop() {
    Ecs.systems.forEach(system => {
      system.update();
    });
    requestAnimationFrame(Ecs.loop);
  }

  /**
   * Remove all systems, entities, and components
   */
  public static stop() {
    Ecs.lastUpdate = -1;
    this.systems.length = 0;
    Entity.entities.length = 0;
  }

  /**
   * Check for new eligibility
   * It checks if entity is eligible to systems and add it if they are
   * @param entity
   * @param component The last added components
   */
  public static checkForNewEligibility(entity: Entity, component: Component) {
    Ecs.systems.forEach((system) => {
      // Check that entity wasn't eligible before adding the new components and that it is after adding it
      if (system.isEligible([...entity.getComponents(), component]) && system.filter.includes(component.constructor as ComponentConstructor<Component>)) {
        system.addEntity(entity, component);
      }
    });
  }

  public static async addSystem(system: System<any>): Promise<void> {
    // Avoid duplicate systems
    if (!Ecs.systems.includes(system)) {
      await system.initialize();
      Ecs.systems.push(system);
      Entity.entities.forEach(entity => {
        if (system.isEligible(entity.getComponents())) {
          system.addEntity(entity, undefined);
        }
      });
    }
  }

  /**
   * This method is called after a components is removed from an entity
   */
  public static onComponentRemovedFromEntity(entity: Entity) {
    Ecs.systems.forEach((system) => {
      if (system.isEligible(entity.getComponents())) {
        system.removeEntity(entity);
      }
    });
  }

  /**
   * Update all systems that needs to be updated
   * If a system has a tps specified, it checks if enough time has passed since last update
   */
  public static update(): void {
    Ecs.systems.forEach(system => system.update());
  }

  /**
   * Return the time passed since the last update in milliseconds
   */
  public static getTimePassedSinceLastUpdate(): number {
    const currentTime = Performance.now();
    const timeSinceLastUpdate = currentTime - Ecs.lastUpdate;
    this.lastUpdate = currentTime;
    return timeSinceLastUpdate;
  }
}
