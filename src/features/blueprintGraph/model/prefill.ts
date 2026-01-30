import type { NodeId } from "./types";

// A field key uniquely identifies a field within a form
export type FieldKey = string;

// Prefill sources indicate where prefill data can come from
export type PrefillSource =
  | {
        kind: "formField";
        nodeId: NodeId;
        fieldKey: FieldKey;
    }
  | {
      kind: "global";
      key: NodeId;
    };

// A mapping from field keys to their prefill sources (or null if no prefill)
export type PrefillMapping = Record<FieldKey, PrefillSource | null>;

// Prefill state for a node: mapping of its fields to prefill sources
export type NodePrefillState = Record<FieldKey, PrefillSource | null>;

// Prefill state by node ID
export type PrefillStateByNode = Record<NodeId, NodePrefillState>;