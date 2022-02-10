import Vue from 'vue';
import {
  Canvas,
  RectDomNode,
  Line,
} from '@package';
import style from './app.scss';

export default Vue.extend({
  mounted() {
    const canvas = new Canvas({
      container: this.$refs.container as HTMLDivElement,
      renderType: 'DOM'
    });
    const node1 = new RectDomNode({
      x: 50,
      y: 50
    });
    const node2 = new RectDomNode({
      x: 250,
      y: 250
    });
    const line = new Line({
      sourceNode: node1,
      targetNode: node2,
      arrow: true,
    });
    canvas.addNode(node1);
    canvas.addNode(node2);
    canvas.addEdge(line);
    console.log(canvas);

    canvas.start();
  },
  render() {
    return (
      <div class={style.editor}>
        <div ref="container" class="container"></div>
      </div>
    );
  }
});
