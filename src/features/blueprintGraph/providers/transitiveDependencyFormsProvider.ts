import { getFieldsForNode } from "../services/fields";
import type { PrefillSourceProvider } from "./types";

export const transitiveDependencyFormsProvider: PrefillSourceProvider = {
  id: "transitive-dependency-forms",
  getGroups({ index, transitiveNodeIds }) {
    const labelOf = (id: string) => index.nodeById.get(id)?.data?.name ?? id;

    const items = transitiveNodeIds.flatMap((nodeId) =>
      getFieldsForNode(index, nodeId).map((f) => ({
        label: `${labelOf(nodeId)}.${f.key}`,
        source: { kind: "formField", nodeId, fieldKey: f.key } as const,
      }))
    );

    return [{ title: "Transitive dependency forms", items }];
  },
};