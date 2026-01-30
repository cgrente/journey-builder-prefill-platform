import type { BlueprintGraph, GraphNode, NodeId } from "../model/types";
import type { GraphIndex } from "./graphIndex";

export function getNodeLabel(node: GraphNode): string {
  return node.data?.name ?? node.id;
}

export function getFormDefinitionIdForNode(index: GraphIndex, nodeId: NodeId): string | undefined {
  return index.formDefinitionIdByNodeId.get(nodeId);
}

export function getGraphNodes(graph: BlueprintGraph): GraphNode[] {
  return (graph.nodes ?? []).filter((graphNode) => graphNode.type === "form");
}