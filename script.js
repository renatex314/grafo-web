/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector("#mcanvas");
const context = canvas.getContext("2d");

const updateCanvasSize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

window.addEventListener("resize", updateCanvasSize);

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
  const minIndex = (Math.floor(i / rows) - 1) * rows;

  const leftIndex = (Math.floor(i / rows) - 1) * rows + (i % rows);
  const leftDiagIndex = leftIndex + 1;
  const rightIndex = (Math.floor(i / rows) + 1) * rows + (i % rows);
  const rightDiagIndex = rightIndex + 1;

  const currentNode = graph.nodes[i];
  const bottomNode = graph.nodes[i + 1];
  const rightNode = graph.nodes[rightIndex];
  const rightDiagNode = graph.nodes[rightDiagIndex];
  const leftDiagNode = graph.nodes[leftDiagIndex];

  if (bottomNode && i + 1 < maxIndex) {
    graph.addEdges(new Edge(currentNode, bottomNode));
  }

  if (rightNode) {
    graph.addEdges(new Edge(currentNode, rightNode));
  }

  if (rightDiagNode && rightDiagIndex <= maxIndex + rows - 1) {
    graph.addEdges(new Edge(currentNode, rightDiagNode));
  }

  if (leftDiagNode && leftDiagIndex <= minIndex + rows - 1) {
    graph.addEdges(new Edge(currentNode, leftDiagNode));
  }
}

for (let i = 0; i < 500; i++) {
  graph.edges[Math.round(Math.random() * (graph.edges.length - 1))].cost =
    Number.POSITIVE_INFINITY;
}

let currentNodeIndex = 0;
let currentOriginNode = graph.nodes[0];

const animatePathsCalculation = () => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  context.globalAlpha = 0.2;
  graph.draw(context);
  context.globalAlpha = 1;

  const pathData = graph.calculateDijkstra(
    currentOriginNode,
    graph.nodes[graph.nodes.length / 2]
  );

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
};

window.addEventListener("mousemove", (ev) => {
  const nearestNode = graph.nodes
    .map((node) => ({
      node,
      distance: Math.sqrt(
        Math.pow(ev.x - node.x, 2) + Math.pow(ev.y - node.y, 2)
      ),
    }))
    .reduce((prev, curr) => (prev.distance < curr.distance ? prev : curr)).node;

  if (currentOriginNode !== nearestNode) {
    currentOriginNode = nearestNode;
    animatePathsCalculation();
  }
});

animatePathsCalculation();
