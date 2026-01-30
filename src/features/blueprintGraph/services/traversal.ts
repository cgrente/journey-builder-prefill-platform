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