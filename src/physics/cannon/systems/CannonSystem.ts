import { Entity, System } from "../../../ecs";
import { Body, Material, Plane, World } from "cannon-es";
import CannonBody from "../components/CannonBody";
import { Transform } from "../../../math";

/**
 * Physics engine using cannon.ts
 */
export default class CannonSystem extends System<[Transform, CannonBody]> {
  #world: World;

  public constructor(tps?: number) {
    super([Transform, CannonBody], tps);
    this.#world = new World();
  }

  public async initialize(): Promise<void> {
    this.#world.gravity.set(0, -9.82, 0);

    const groundShape = new Plane();
    const groundBody = new Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.position.set(0, 0, 0);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.#world.addBody(groundBody);
    groundBody.material = new Material({ restitution: 0.6, friction: 0 });
  }

  public onEligible(entity: Entity) {
    const transform = entity.getComponent(Transform);
    const cannonBody = entity.getComponent(CannonBody);
    if (!cannonBody || !transform) {
      throw new Error(`Entity eligible to Cannon System with no body ${entity}`);
    }

    // Set initial body position from transform
    const worldPosition = transform.getModelToWorldMatrix();
    cannonBody.body.position.x = worldPosition[0];
    cannonBody.body.position.y = worldPosition[1];
    cannonBody.body.position.z = worldPosition[2];

    this.#world.addBody(cannonBody.body);
  }

  public onUpdate(entities: [Transform, CannonBody][], timePassed: number): void {
    entities.forEach(([transform, entityBody]) => {
      const maxSubSteps = 3;
      this.#world.step(1 / 60, timePassed, maxSubSteps);

      // Update transform from body
      const position = entityBody.body.position;
      transform.setWorldPosition([position.x, position.y, position.z]);
    });
  }
}
