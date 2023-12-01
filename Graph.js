class Graph {

  /**
   *  @param {Array<Node>?} nodes
   *  @param {Array<Edge>?} edges
   */
  constructor(nodes = null, edges = null) {
    /**
     * @type {Array<GraphNode>}
     */
    this.nodes = nodes || [];
    /**
     * @type {Array<Edge>}
     */
    this.edges = edges || [];
  }

  /**
   * 
   * @param  {...GraphNode} nodes 
   */
  addNodes(...nodes) {
    this.nodes = this.nodes.concat(nodes);
  }

  /**
   * 
   * @param {...Edge} edges 
   */
  addEdges(...edges) {
    this.edges = this.edges.concat(edges);
  }

  /**
   * 
   * @param {GraphNode} node 
   */
  getNodeEdges(node) {
    const edges = [];
    
    for (let i = 0; i < this.edges.length; i++) {
      const currentEdge = this.edges[i];

      if (currentEdge.node1.uuid === node.uuid || currentEdge.node2.uuid === node.uuid) {
        edges.push(currentEdge);
      }
    }

    return edges;
  }

  /**
   * @param {GraphNode} rootNode
   * @param {Array<Edge>} edges
   */
  getNodeConnectedNodesByEdges(rootNode, edges) {
    const nodes = [];

    for (let i = 0; i < edges.length; i++) {
      const currentEdge = edges[i];
      
      if (currentEdge.node1 === rootNode) {
        nodes.push(currentEdge.node2);
      } else {
        nodes.push(currentEdge.node1);
      }
    }

    return nodes;
  }

  /**
   * 
   * @param {Array<Edge>} edges 
   */
  getLessCostEdge(edges) {
    return edges.reduce((prev, curr) => curr.getCost() < prev.getCost() ? curr : prev);
  }

  /**
   * 
   * @param {GraphNode} startNode 
   * @param {GraphNode} finalNode 
   */
  calculateDijkstra(startNode, finalNode) {
    /**
     * @typedef {{cost: number, previousNodeUuid: string | null, visited: boolean}} DistanceTable
     * @type {Object.<string, DistanceTable>}
     */

    const dijkstraTable = {};

    for (let i = 0; i < this.nodes.length; i++) {
      dijkstraTable[this.nodes[i].uuid] = {
        cost: Number.POSITIVE_INFINITY,
        previousNodeUuid: null,
        visited: false
      };
    }

    dijkstraTable[startNode.uuid] = { cost: 0, previousNodeUuid: startNode.uuid, visited: false };

    for (let j = 0; j < this.nodes.length; j++) {
      const lessCostNotVisitedNodeUuid = Object
        .keys(dijkstraTable)
        .filter((uuid) => !dijkstraTable[uuid].visited)
        .reduce((prev, curr) => 
          (
            dijkstraTable[prev].cost < dijkstraTable[curr].cost
          ) 
          ? 
          prev 
          : 
          curr
        );
  
      const currentNode = this.nodes.find((node) => node.uuid === lessCostNotVisitedNodeUuid);

      const connectedNodesData = this.getNodeEdges(currentNode).map((edge) => ({
        edgeCost: edge.getCost(),
        connectedNode: edge.node1 === lessCostNotVisitedNodeUuid ? edge.node2 : edge.node2
      }));

      for (let j = 0; j < connectedNodesData.length; j++) {
        const connectedNodeData = connectedNodesData[j];
        const totalCost = dijkstraTable[lessCostNotVisitedNodeUuid].cost + connectedNodeData.edgeCost;

        if (dijkstraTable[connectedNodeData.connectedNode.uuid].cost > totalCost) {
          dijkstraTable[connectedNodeData.connectedNode.uuid] = {
            previousNodeUuid: lessCostNotVisitedNodeUuid,
            cost: totalCost,
            visited: dijkstraTable[connectedNodeData.connectedNode.uuid].visited
          }
        }
      }

      dijkstraTable[lessCostNotVisitedNodeUuid].visited = true;
    }

    const finalNodes = [];
    const finalEdges = [];
    let currentUuid = finalNode.uuid;
    let reachedStart = false;

    while (!reachedStart) {
      const nextUuid = dijkstraTable[currentUuid].previousNodeUuid;

      if (currentUuid === nextUuid || nextUuid === null) {
        finalNodes.push(
          this.nodes.find((node) => node.uuid === currentUuid)
        );

        reachedStart = true;
        break;
      }
      
      finalNodes.push(this.nodes.find((node) => node.uuid === currentUuid));
      finalEdges.push(this.edges.find((edge) => 
          (edge.node1.uuid === currentUuid && edge.node2.uuid === dijkstraTable[currentUuid].previousNodeUuid) 
          ||
          (edge.node2.uuid === currentUuid && edge.node1.uuid === dijkstraTable[currentUuid].previousNodeUuid)
        )
      );

      currentUuid = nextUuid;
    }

    return { nodes: finalNodes.reverse(), edges: finalEdges };
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} canvasContext 
   */
  draw(canvasContext) {
    for (let i = 0; i < this.edges.length; i++) {
      this.edges[i].draw(canvasContext);
    }

    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].draw(canvasContext);
    }
  }

}