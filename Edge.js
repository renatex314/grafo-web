class Edge {
  /**
   *
   * @param {GraphNode} node1
   * @param {GraphNode} node2
   */
  constructor(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;
    this.calculateCost();
  }

  calculateCost() {
    this.cost = Math.sqrt(
      Math.pow(this.node1.x - this.node2.x, 2) +
        Math.pow(this.node1.y - this.node2.y, 2)
    );
  }

  getCost() {
    return this.cost;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} canvasContext
   * @param {boolean} highlighted
   */
  draw(canvasContext, highlighted = false) {
    if (this.cost !== Number.POSITIVE_INFINITY) {
      canvasContext.beginPath();
      canvasContext.moveTo(this.node1.x, this.node1.y);
      canvasContext.lineTo(this.node2.x, this.node2.y);
      canvasContext.lineCap = 'round';
      canvasContext.strokeStyle = highlighted ? "orange" : "black";
      canvasContext.lineWidth = 10;
      canvasContext.stroke();
      canvasContext.closePath();
    }
  }
}
