import type { BlueprintGraph, NodeId } from "../model/types";
import type { GraphIndex } from "../services/graphIndex";
import type { PrefillSource } from "../model/prefill";

export type SourceItem = {
  label: string;
  source: PrefillSource;
};

export type SourceGroup = {
  title: string;
  items: SourceItem[];
};

export interface PrefillSourceProvider {
  id: string;
  getGroups(args: {
    graph: BlueprintGraph;
    index: GraphIndex;
    targetNodeId: string;
    directNodeIds: NodeId[];
    transitiveNodeIds: NodeId[];
    depthMap: Map<NodeId, number>;
  }): SourceGroup[];
}