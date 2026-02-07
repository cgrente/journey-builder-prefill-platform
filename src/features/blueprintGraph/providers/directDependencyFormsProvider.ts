import { getFieldsForNode } from "../services/fields";
import type { PrefillSourceProvider } from "./types";

export const directDependencyFormsProvider: PrefillSourceProvider = {
  id: "direct-dependency-forms",
  getGroups({ index, directNodeIds, depthMap }) {
    const labelOf = (id: string) => index.nodeById.get(id)?.data?.name ?? id;

    const depthSuffix = (nodeId: string) => {
      const depth = depthMap.get(nodeId);
      return depth ? ` (d=${depth})` : "";
    };

    const items = directNodeIds.flatMap((nodeId) =>
      getFieldsForNode(index, nodeId).map((f) => ({
        label: `${labelOf(nodeId)}.${f.key}${depthSuffix(nodeId)}`,
        source: { kind: "formField", nodeId, fieldKey: f.key } as const,
      }))
    );

    return [{ title: "Direct dependency forms", items }];
  },
};