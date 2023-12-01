class GraphNode {

  constructor(x, y) {
    this.uuid = crypto.randomUUID();
    this.x = x;
    this.y = y;
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} canvasContext 
   */
  draw(canvasContext) {
    canvasContext.beginPath();
    canvasContext.arc(this.x, this.y, 20, 0, 2*Math.PI, false);
    canvasContext.fillStyle = 'blue';
    canvasContext.fill();
    canvasContext.closePath();
  }

}