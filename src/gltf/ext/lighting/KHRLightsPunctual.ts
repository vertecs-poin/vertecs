// import Component from '@ecs/Component';
// import { vec3 } from 'gl-matrix';
// import Entity from '@ecs/Entity';
// import GLTFExtension from '@gltf/ext/GLTFExtension';
//
// export class KHRLightsPunctual extends GLTFExtension {
//   private readonly lights: Component[];
//
//   public constructor() {
//     super('KHR_lights_punctual');
//     this.lights = [];
//   }
//
//   public importExtension(json: any) {
//     json.lights.forEach((lightJSON: any) => {
//       let light;
//       const color = lightJSON.color
//         ? vec3.fromValues(lightJSON.color[0], lightJSON.color[1], lightJSON.color[2]) : vec3.fromValues(1, 1, 1);
//       switch (lightJSON.type) {
//         case 'directional': {
//           light = new DirectionalLight(color, lightJSON.intensity, lightJSON.range);
//           break;
//         }
//         case 'point': {
//           light = new PointLight(color, lightJSON.intensity, lightJSON.range);
//           break;
//         }
//         case 'spot': {
//           const {innerConeAngle} = lightJSON.spot;
//           const {outerConeAngle} = lightJSON.spot;
//           light = new SpotLight(color, innerConeAngle, outerConeAngle);
//           break;
//         }
//         default: {
//           console.error('Light type not supported: ', lightJSON.type);
//         }
//       }
//       if (light) {
//         this.lights.push(light);
//       }
//     });
//   }
//
//   public importNode(node: Entity, json: any) {
//     const light = this.lights[json.light];
//     if (light) {
//       node.addComponent(light);
//     } else {
//       console.error('An error occurred while importing light from gltf');
//     }
//   }
// }
