import { Accessor } from "./index";
import { Entity } from "../ecs";
import { Joint, Skeleton, Skin } from "../skinning";
import { Transform } from "../math";
import { GltfOptions } from "./GltfFactory";
import { mat4 } from "gl-matrix";

export interface SkinJson extends GltfOptions {
  inverseBindMatrices?: number;
  skeleton?: number;
  joints: number[];
}

export default class SkinFactory {

  public static fromJson(skinJson: SkinJson, transformOfNodeThatTheMeshIsAttachedTo: Transform, nodes: Entity[], accessor?: Accessor): Skin {
    const inverseBindMatrices = accessor?.getDataAsFloat32Array();

    const skin = new Skin(new Skeleton());

    const joints = [];
    skinJson.joints.forEach((joint, i) => {
      const inverseBindMatrix = inverseBindMatrices?.slice(i * 16, i * 16 + 16) || mat4.create();
      const jointComponent = new Joint(i, skin, inverseBindMatrix, transformOfNodeThatTheMeshIsAttachedTo);
      nodes[joint].addComponent(jointComponent);
      joints.push(jointComponent);
    });

    return skin;
  }
}
