import Component from "./Component";
import Ecs from "./Ecs";

interface EntityOptions {
  name?: string,
  components?: Component[],
  children?: Entity[],
}

export type ComponentConstructor<T> = new (...args: any[]) => T;

/**
 * An entity is a general purpose object which contains components
 */
export default class Entity {
  public static entities: Entity[] = [];

  public static LAST_ID = 0;

  readonly #id: number;

  readonly #components: Map<Function, Component>;

  #parent?: Entity;

  readonly #children: Entity[];

  #name?: string;

  public constructor(options?: EntityOptions) {
    this.#id = Entity.LAST_ID++;
    this.#children = options?.children ?? [];
    this.#components = new Map();
    this.#name = options?.name;
    // Add components one by one to trigger events
    options?.components?.forEach((component) => this.addComponent(component));
    Entity.entities.push(this);
  }

  /**
   * Return the first child found with the specified name
   * @param name The child name
   */
  public findChildByName(name: string): Entity | undefined {
    for (const child of this.children) {
      if (child.name === name) {
        return child;
      }
    }
    for (const child of this.children) {
      const found = child.findChildByName(name);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  public findChildByComponent(component: ComponentConstructor<Component>): Entity | undefined {
    if (this.getComponent(component)) {
      return this;
    }
    for (const child of this.children) {
      if (child.getComponent(component)) {
        return child;
      }
    }
    for (const child of this.children) {
      const found = child.findChildByComponent(component);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  /**
   * Return a component by its class
   * @param componentClass The component's class
   */
  public getComponent<T extends Component>(componentClass: ComponentConstructor<T>): T | undefined {
    return this.#components.get(componentClass) as T;
  }

  /**
   * Return all components present in the entity
   * @param filter
   */
  public getComponents<T extends Component>(filter?: ComponentConstructor<Component>[]): T[] {
    if (!filter) {
      // Return all components when no filter is given
      return Array.from(this.#components.values()) as T[];
    }
    const components = this.components.filter(component => filter.includes(component.constructor as ComponentConstructor<Component>));
    // Sort components to return the components in the same order as the classes parameter
    return components.sort((a, b) =>
      filter.indexOf(a.constructor as ComponentConstructor<Component>) -
      filter.indexOf(b.constructor as ComponentConstructor<Component>)) as T[];
  }

  /**
   * Add a component to this entity
   * @param component The component to add
   */
  public addComponent(component: Component) {
    if (!this.#components.get(component.constructor)) {
      this.#components.set(component.constructor, component);
      Ecs.checkForNewEligibility(this, component);
      component.onAddedToEntity(this);
    }
  }

  /**
   * Add a child to this entity
   * @param entity The child
   */
  public addChild(entity: Entity) {
    this.#children.push(entity);
    entity.parent = this;
  }

  /**
   * Remove a components from this entity
   * @param componentClass The component's class to remove
   */
  public removeComponent(componentClass: Function) {
    this.#components.delete(componentClass);
    Ecs.onComponentRemovedFromEntity(this);
  }

  /**
   * Clone an entity's name, components and children
   */
  public clone(): Entity {
    return new Entity({
      name: this.#name,
      children: this.children.map((child) => child.clone()),
      components: Array.from(this.#components.values()).map((component) => component.clone())
    });
  }

  /**
   * Destroy this entity, remove and destroy all added components
   */
  public destroy(): void {
    for (let i = this.components.length - 1; i >= 0; i--) {
      this.removeComponent(this.components[i].constructor);
      this.components[i].onDestroyed();
    }
  }

  public getRoot(): Entity | undefined {
    let entity = this.#parent;
    while (entity?.parent) {
      entity = entity.#parent;
    }
    return entity;
  }

  public get components(): Component[] {
    return Array.from(this.#components.values());
  }

  public get parent(): Entity | undefined {
    return this.#parent;
  }

  public set parent(value: Entity | undefined) {
    this.#parent = value;
    this.components.forEach(component => component.onEntityParentChange(this));
  }

  public get name(): string | undefined {
    return this.#name;
  }

  public set name(value: string | undefined) {
    this.#name = value;
  }

  public get children(): Entity[] {
    return this.#children;
  }

  public get id(): number {
    return this.#id;
  }
}
