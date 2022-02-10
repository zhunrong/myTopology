import Layout, { Transport } from './Layout';
import Vector2d from '../utils/Vector2d';

const PI2 = Math.PI * 2;

/**
 * 环形布局
 */
export class CircularLayout extends Layout {
  clockwise = true;
  radius = 0;
  startAngle = 0;
  endAngle = Math.PI * 2;
  duration = 0;
  gap = 10;
  nodeRadius = 50;

  layout() {
    this.canvas.layout = this;
    const nodes = this.canvas.rootNode.children;
    const count = nodes.length;
    if (count === 0) return;

    this.transports = [];
    let totalAngle = Math.abs(this.endAngle - this.startAngle);
    // 圈数
    let rounds = 0;
    // 每圈个数
    let nums = 0;
    // 内圈半径
    let innerRadius = this.radius;

    if (totalAngle > 0) {
      rounds = Math.ceil(totalAngle / PI2);
      nums = Math.ceil(count / (totalAngle / PI2));
      innerRadius = (this.nodeRadius + this.gap / 2) / Math.sin(rounds === 1 ? totalAngle / count / 2 : PI2 / nums / 2);
    } else if (innerRadius > 0) {
      const avgAngle = Math.asin((this.nodeRadius + this.gap / 2) / innerRadius) * 2;
      nums = Math.floor(PI2 / avgAngle);
      rounds = Math.ceil(count / nums);
      totalAngle = PI2 / nums * count;
    } else {
      totalAngle = PI2;
      rounds = 1;
      nums = count;
      innerRadius = (this.nodeRadius + this.gap / 2) / Math.sin(totalAngle / count / 2);
    }
    const origin = new Vector2d(this.canvas.canvasWidth / 2, this.canvas.canvasHeight / 2);

    for /* 圈数 */ (let r = 1; r <= rounds; r++) {
      for /* 节点次序 */ (let n = 1; n <= nums; n++) {
        const node = nodes[(r - 1) * nums + n - 1];
        if (!node) break;
        const transport = new Transport();
        this.transports.push(transport);
        transport.node = node;
        transport.duration = this.duration;
        transport.destination.copy(Vector2d.xAxis);
        const radius = innerRadius + (r - 1) * (this.nodeRadius * 2 + this.gap);
        if /* 最后一圈 */ (r === rounds) {
          const lastAngle = totalAngle % PI2 || PI2;
          const lastNum = count % nums || nums;
          const angleInterval = lastAngle === PI2 ? lastAngle / lastNum : lastAngle / ((lastNum - 1) || 2);
          const angle = angleInterval * (n % lastNum);
          const rotate = this.startAngle + (this.clockwise ? angle : -angle);
          transport.destination.scale(radius).rotate(rotate).add(origin);
        } else {
          const angleInterval = PI2 / nums;
          const angle = angleInterval * (n - 1);
          const rotate = this.startAngle + (this.clockwise ? angle : -angle);
          transport.destination.scale(radius).rotate(rotate).add(origin);
        }
      }
    }

    this.canvas.repaint = true;
  }

}

export default CircularLayout;
