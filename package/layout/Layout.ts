import Canvas from '../core/Canvas';
import Vector2d from '../utils/Vector2d';
import Node from '../graph/Node';

export class Transport {
  destination = new Vector2d();
  distance = new Vector2d();
  speed = new Vector2d();
  node: Node | null = null;
  duration = 0;
  pass = 0;
  complete = false;
  update(timeDelta: number) {
    if (!this.node || this.complete) return;
    this.pass += timeDelta;
    const timeRemain = this.duration > this.pass ? this.duration - this.pass : 0;
    this.distance.copy(this.destination).substract(this.node.centerPoint);
    if (timeDelta < timeRemain) {
      if (this.distance.magnitude > 1) {
        this.speed.copy(this.distance).scale(1 / timeRemain * timeDelta);
        this.node.translate(this.speed);
      } else {
        this.complete = true;
      }
    } else {
      this.node.translate(this.distance);
      this.complete = true;
    }
  }
}

export abstract class Layout {
  canvas: Canvas;
  transports: Transport[] = [];
  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  /**
   * 更新
   */
  update(): boolean {
    const activeTrans = this.transports.filter(item => !item.complete);
    this.canvas.optimizeNode();
    if (!activeTrans.length) return false;
    const timeDelta = this.canvas.clock.getDelta();
    activeTrans.forEach(transport => transport.update(timeDelta));
    return true;
  }

  /**
   * 布局
   */
  abstract layout(): void

}

export default Layout;
