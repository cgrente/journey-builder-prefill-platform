import type { BlueprintGraph, FormDefinition, FormDefinitionId, NodeId, GraphNode } from "../model/types";

export type GraphIndex = {
    incomingById: Map<NodeId, NodeId[]>
    outgoingById: Map<NodeId, NodeId[]>
    nodeById: Map<NodeId, GraphNode>
    formDefinitionById: Map<FormDefinitionId, FormDefinition>
    formDefinitionIdByNodeId: Map<NodeId, FormDefinitionId>
}

function pushMapList<K, V>(map: Map<K, V[]>, key: K, value: V) {
  const arr = map.get(key);
  if (arr) arr.push(value);
  else map.set(key, [value]);
}

// Build an index for quick lookup of graph relationships and form definitions
export function buildGraphIndex(graph: BlueprintGraph): GraphIndex {
  // ensure arrays are defined
  const graphNodes = graph.nodes ?? [];
  const graphEdges = graph.edges ?? [];
  const forms = graph.forms ?? [];

  // lookup index for my graph to avoid repeated scans of the arrays
  const incomingById = new Map<NodeId, NodeId[]>(); // For a node → which nodes point into it (parents)
  const outgoingById = new Map<NodeId, NodeId[]>(); // For a node → which nodes it points to (children)
  const nodeById = new Map<NodeId, GraphNode>(); // Quick access to any node by id
  const formDefinitionById = new Map<FormDefinitionId, FormDefinition>(); // Quick access to form schema by form id
  const formDefinitionIdByNodeId = new Map<NodeId, FormDefinitionId>(); // Link between graph node and form definition

  for (const form of forms) {
    formDefinitionById.set(form.id, form);
  }

  for (const graphNode of graphNodes) {
    nodeById.set(graphNode.id, graphNode);

    const formDefId = graphNode.data?.component_id;
    if (formDefId) {
      formDefinitionIdByNodeId.set(graphNode.id, formDefId);
    }
  }

  for (const graphEdge of graphEdges) {
    // parent → child
    pushMapList(outgoingById, graphEdge.source, graphEdge.target);
    // child → parent
    pushMapList(incomingById, graphEdge.target, graphEdge.source);
  }

  // ensure every node has an entry in the maps
  for (const graphNode of graphNodes) {
    if (!incomingById.has(graphNode.id)) {
      incomingById.set(graphNode.id, []);
    }
    if (!outgoingById.has(graphNode.id)) {
      outgoingById.set(graphNode.id, []);
    }
  }

  return {
    incomingById,
    outgoingById,
    nodeById,
    formDefinitionById,
    formDefinitionIdByNodeId,
  };
}