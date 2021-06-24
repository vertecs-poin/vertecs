# Vertecs

Vertecs is a 3D engine using WebGPU and based on the ECS framework.

## Usage

Hello cube :

    import {
      CameraKeyboardInputSystem,
      CameraSystem,
      CannonSystem,
      Ecs,
      WebGpuSystem
    } from "vertecs";
    import FlatTerrainFactory from "./entities/FlatTerrainFactory";

    await Ecs.addSystem(new CameraKeyboardInputSystem("canvas", 8));
    await Ecs.addSystem(new CameraSystem(8));
    await Ecs.addSystem(new WebGpuSystem(8));

    const cube = CubeFactory.create(1, 1, 1);

    Ecs.start();

## Contributing

Vertecs follows the Conventional Commits (https://www.conventionalcommits.org/en/v1.0.0/).

The following types only are allowed: fix, feat, docs, style, refactor, perf, test, build, ci, cd, chore, revert,
security, release, hotfix.
