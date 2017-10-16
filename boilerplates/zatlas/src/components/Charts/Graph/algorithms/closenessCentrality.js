/**
 * @Author: mark
 * @Date:   2017-04-07T11:02:20+08:00
 * @Email:  mark_z1988@icloud.com
 * @Filename: closenessCentrality.js
 * @Last modified by:   mark
 * @Last modified time: 2017-04-24T12:25:06+08:00
 * @License: MIT
 */

/**
 * I'm using https://networkx.github.io/documentation/development/_modules/networkx/algorithms/centrality/closeness.html
 * as a reference for this implementation
 */
/* eslint-disable */
export default function betweennes(graph, oriented) {
  var Q = [],
    S = []; // Queue and Stack
  // list of predcessors on shorteest paths from source
  var pred = Object.create(null);
  // distance from source
  var dist = Object.create(null);

  var currentNode;
  var centrality = Object.create(null);

  graph.forEachNode(setCentralityToZero);
  graph.forEachNode(calculateCentrality);


  return centrality;

  function setCentralityToZero(node) {
    centrality[node.id] = 0;
  }


  function calculateCentrality(node) {
    currentNode = node.id;
    singleSourceShortestPath(currentNode);
    accumulate();
  }

  function calcTotalSp(){
    let total = 0;
    while (S.length) {
      let w = S.pop();
      let predcessors = pred[w];
      if(predcessors.length > 0){
        total += 1;
        while (predcessors[0] !== currentNode){//may improve later
          predcessors = pred[predcessors[0]];
          total += 1;
        }
      }
    }
    return total;
  }

  function accumulate() {
    let nodeLength = S.length;
    let totalSp = calcTotalSp();
    if(totalSp > 0 && nodeLength > 1){
      centrality[currentNode] = (nodeLength - 1) / totalSp;
    } else {
      centrality[currentNode] = 0;
    }
  }


  function singleSourceShortestPath(source) {
    graph.forEachNode(initNode);
    dist[source] = 0;
    sigma[source] = 1;
    Q.push(source);

    while (Q.length) {
      var v = Q.shift();
      var dedup = Object.create(null);
      S.push(v);
      graph.forEachLinkedNode(v, toId, oriented);
    }

    function toId(otherNode) {
      // NOTE: This code will also consider multi-edges, which are often
      // ignored by popular software (Gephi/NetworkX). Depending on your use
      // case this may not be desired and deduping needs to be performed. To
      // save memory I'm not deduping here...
      processNode(otherNode.id);
    }

    function initNode(node) {
      var nodeId = node.id;
      pred[nodeId] = []; // empty list
      dist[nodeId] = -1;
      sigma[nodeId] = 0;
    }

    function processNode(w) {
      // path discovery
      if (dist[w] === -1) {
        // Node w is found for the first time
        dist[w] = dist[v] + 1;
        Q.push(w);
      }
      // path counting
      if (dist[w] === dist[v] + 1) {
        // edge (v, w) on a shortest path
        pred[w].push(v);
      }
    }
  }
}
