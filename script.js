/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector('#mcanvas');
const context = canvas.getContext('2d');

const updateCanvasSize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', updateCanvasSize);

updateCanvasSize();

const graph = new Graph();

const rows = 10;
const columns = 19;

for (let i = 1; i < columns; i++) {
  for (let j = 1; j < rows; j++) {
    graph.addNodes(new GraphNode(100 * i, 100 * j));
  }
}

// for (let i = 0; i < )

// for (let i = 0; i < 30; i ++) {
//   graph.addNodes(new GraphNode(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
// }

// for (let i = 0; i < 20; i++) {
//   const randomNode1 = graph.nodes[Math.round(Math.random() * (graph.nodes.length - 1))];
//   const randomNode2 = graph.nodes[Math.round(Math.random() * (graph.nodes.length - 1))];
//   graph.addEdges(new Edge(randomNode1, randomNode2));
// }

graph.draw(context);
