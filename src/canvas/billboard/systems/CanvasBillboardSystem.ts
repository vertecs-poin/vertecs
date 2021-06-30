import { System } from "../../../ecs";
import CanvasBillboardComponent from "../components/CanvasBillboardComponent";
import { Transform } from "../../../math";

export default class CanvasBillboardSystem extends System<[CanvasBillboardComponent, Transform]> {
  #canvas?: HTMLCanvasElement;
  #context: CanvasRenderingContext2D | null | undefined;

  public constructor(tps?: number) {
    super([CanvasBillboardComponent, Transform], tps);
  }

  public async initialize(): Promise<void> {
    this.#canvas = document.getElementById("billboard_canvas") as HTMLCanvasElement;
    this.#context = this.#canvas.getContext("2d");
  }

  public onUpdate(entities: [CanvasBillboardComponent, Transform][], timePassed: number): void {
    this.#context?.clearRect(0, 0, this.#context?.canvas.width, this.#context?.canvas.height);

    entities.forEach(([billboardComponent, transform]) => {
      this.#context?.fillText("testtttttttttttttttt", 10, 10);
    });
  }
}
