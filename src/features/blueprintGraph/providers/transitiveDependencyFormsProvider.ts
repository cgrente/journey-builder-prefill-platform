import { getFieldsForNode } from "../services/fields";
import type { PrefillSourceProvider } from "./types";

export const transitiveDependencyFormsProvider: PrefillSourceProvider = {
  id: "transitive-dependency-forms",
  getGroups({ index, transitiveNodeIds, depthMap }) {
    const labelOf = (id: string) => index.nodeById.get(id)?.data?.name ?? id;
    
    const depthSuffix = (nodeId: string) => {
      const depth = depthMap.get(nodeId);
      return depth ? ` (depth=${depth})` : "";
    };
    
    const items = transitiveNodeIds.flatMap((nodeId) =>
      getFieldsForNode(index, nodeId).map((f) => ({
        label: `${labelOf(nodeId)}.${f.key}${depthSuffix(nodeId)}`,
        source: { kind: "formField", nodeId, fieldKey: f.key } as const,
      }))
    );

    return [{ title: "Transitive dependency forms", items }];
  },
};