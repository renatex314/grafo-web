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

for (let i = 1; i < columns + 1; i++) {
  for (let j = 1; j < rows + 1; j++) {
    graph.addNodes(new GraphNode(100 * i, 100 * j));
  }
}

for (let i = 0; i < graph.nodes.length - 1; i++) {
  const maxIndex = (Math.floor(i / rows) + 1) * rows;

  const rightIndex = (Math.floor(i / rows) + 1) * rows + i % rows;
  const diagIndex = rightIndex + 1;

  const currentNode = graph.nodes[i];
  const bottomNode = graph.nodes[i + 1];
  const rightNode = graph.nodes[rightIndex];
  const diagNode = graph.nodes[diagIndex];

  if (bottomNode && i + 1 < maxIndex) {
    graph.addEdges(new Edge(currentNode, bottomNode));
  }

  if (rightNode) {
    graph.addEdges(new Edge(currentNode, rightNode));
  }

  if (diagNode && diagIndex <= maxIndex + rows - 1) {
    graph.addEdges(new Edge(currentNode, diagNode));
  }
}

let currentNodeIndex = 0;

setInterval(() => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  graph.draw(context);
  const pathData = graph.calculateDijkstra(graph.nodes[10], graph.nodes[currentNodeIndex]);

  for (let i = 0; i < pathData.edges.length; i++) {
    pathData.edges[i].draw(context, true);
  }

  for (let i = 0; i < pathData.nodes.length; i++) {
    pathData.nodes[i].draw(context);
  }

  currentNodeIndex++;

  if (currentNodeIndex > graph.nodes.length - 1) {
    currentNodeIndex = 0;
  }
}, 100);