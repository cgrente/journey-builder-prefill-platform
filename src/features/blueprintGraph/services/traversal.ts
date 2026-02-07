import type { NodeId } from "../model/types";
import type { GraphIndex } from "./graphIndex";

export function getDirectParents(index: GraphIndex, targetNodeId: NodeId): NodeId[] {
  return index.incomingById.get(targetNodeId) ?? [];
}

export function getAncestors(index: GraphIndex, targetNodeId: NodeId): NodeId[] {
  const visited = new Set<NodeId>();
  const stack: NodeId[] = [...getDirectParents(index, targetNodeId)];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (visited.has(current)) continue;

    visited.add(current);

    const parents = index.incomingById.get(current) ?? [];
    for (const p of parents) {
      if (!visited.has(p)) stack.push(p);
    }
  }

  return Array.from(visited);
}

export function partitionDependencies(index: GraphIndex, targetNodeId: NodeId) {
  const direct = getDirectParents(index, targetNodeId);
  const ancestors = getAncestors(index, targetNodeId);

  const directSet = new Set(direct);
  const transitive = ancestors.filter((id) => !directSet.has(id));

  return { direct, transitive };
}

export function partitionDependenciesWithDepth(index: GraphIndex, targetNodeId: NodeId) {
  const depthMap: Map<NodeId, number> = getDependencyDepths(index, targetNodeId);
  const direct: NodeId[] = [];
  const transitive: NodeId[] = [];

  for (const [nodeId, depth] of depthMap) {
    if (depth === 1) {
      direct.push(nodeId);
    } else {
      transitive.push(nodeId);
    }
  }

  return  { direct, transitive };
}

type QueueItem = {
  nodeId: NodeId;
  depth: number;
}

export function getDependencyDepths(index: GraphIndex, targetNodeId: NodeId): Map<NodeId, number> {
  const direct: NodeId[] = getDirectParents(index, targetNodeId);

  const dependencyDepths: Map<NodeId, number> = new Map();

  const queue: QueueItem[] = direct.map((nodeId: NodeId) => ({ nodeId, depth: 1}))

  for (const nodeId of direct) {
    dependencyDepths.set(nodeId, 1);
  }

  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) continue;
    
    const parents: NodeId[] = getDirectParents(index, item.nodeId);
    
    for (const parentId of parents) {
      const nextDepth = item.depth + 1;

      const visited = dependencyDepths.get(parentId);
      if (visited === undefined || nextDepth < visited) {
        dependencyDepths.set(parentId, nextDepth);
        queue.push(({nodeId: parentId, depth: nextDepth}))
      }
    }
  }

  return dependencyDepths;
}