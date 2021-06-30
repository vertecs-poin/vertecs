import { Entity, System } from "../../../ecs";
import { Body, Material, NaiveBroadphase, Plane, Vec3, World } from "cannon-es";
import CannonBody from "../components/CannonBody";
import { Transform } from "../../../math";
import { quat, vec3 } from "gl-matrix";

/**
 * Physics engine using cannon.ts
 */
export default class CannonSystem extends System<[Transform, CannonBody]> {
  #world: World;

  public constructor(tps?: number) {
    super([Transform, CannonBody], tps);
    this.#world = new World();
    this.#world.broadphase = new NaiveBroadphase();
  }

  public async initialize(): Promise<void> {
    this.#world.gravity.set(0, -9.82, 0);
    this.#world.defaultContactMaterial.contactEquationStiffness = 1e6;
    this.#world.defaultContactMaterial.contactEquationRelaxation = 10;
    // @ts-ignore
    this.#world.solver.iterations = 20;

    const groundBody = new Body({ mass: 0 });
    const groundShape = new Plane();
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.#world.addBody(groundBody);
  }

  public onEligible(entity: Entity) {
    const transform = entity.getComponent(Transform);
    const cannonBody = entity.getComponent(CannonBody);
    if (!cannonBody || !transform) {
      throw new Error(`Entity eligible to Cannon System with no body ${entity}`);
    }

    // Set initial body position from transform
    const worldPosition = transform.getWorldTranslation(vec3.create());
    const worldRotation = transform.getWorldRotation(quat.create());

    cannonBody.body.position.x = worldPosition[0];
    cannonBody.body.position.y = worldPosition[1];
    cannonBody.body.position.z = worldPosition[2];

    cannonBody.body.quaternion.x = worldRotation[0];
    cannonBody.body.quaternion.y = worldRotation[1];
    cannonBody.body.quaternion.z = worldRotation[2];
    cannonBody.body.quaternion.w = worldRotation[3];

    this.#world.addBody(cannonBody.body);
  }

  public onUpdate(entities: [Transform, CannonBody][], timePassed: number): void {
    const maxSubSteps = 3;
    this.#world.step(1.0 / 60.0, timePassed, maxSubSteps);

    entities.forEach(([transform, entityBody]) => {
      // Update transform from body
      const position = entityBody.body.position;
      transform.setPosition([position.x, position.y, position.z]);

      const rotation = entityBody.body.quaternion;
      transform.setRotationXyzw(rotation.x, rotation.y, rotation.z, rotation.w);
    });
  }
}
