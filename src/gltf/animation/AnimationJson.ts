import { AnimationSamplerJson } from "../../animation/AnimationSamplerFactory";
import { AnimationChannelJson } from "./AnimationChannel";

export default interface AnimationJson {
  samplers: AnimationSamplerJson[];
  channels: AnimationChannelJson[]
}
