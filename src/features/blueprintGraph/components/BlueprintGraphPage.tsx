import { useEffect, useMemo, useState } from "react";
import { useBlueprintGraph } from "../state/useBlueprintGraph";
import { buildGraphIndex } from "../services/graphIndex";
import { getGraphNodes, getNodeLabel } from "../services/selectors";
import type { NodeId } from "../model/types";
import { PrefillPanel } from "./PrefillPanel";
import type { PrefillSource, PrefillStateByNode, NodePrefillState } from "../model/prefill";

const PREFILL_STORAGE_KEY = "journey-prefill:v1";

function loadPrefillFromStorage(): PrefillStateByNode {
  try {
    const raw = localStorage.getItem(PREFILL_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};

    return parsed as PrefillStateByNode;
  } catch {
    // corrupt json or blocked access - error message
    return {};
  }
}

function savePrefillToStorage(state: PrefillStateByNode) {
  try {
    const stringify = JSON.stringify(state);
    localStorage.setItem(PREFILL_STORAGE_KEY, stringify);
  } catch {
    // storage full / blocked etc..
  }
}


export function BlueprintGraphPage() {
  const { data, isLoading, error } = useBlueprintGraph();

  const [selectedNodeId, setSelectedNodeId] = useState<NodeId | null>(null);
  // const [prefillByNode, setPrefillByNode] = useState<PrefillStateByNode>({});
  const [prefillByNode, setPrefillByNode] = useState<PrefillStateByNode>(() => loadPrefillFromStorage());

  const index = useMemo(() => (data ? buildGraphIndex(data) : null), [data]);
  const nodes = useMemo(() => (data ? getGraphNodes(data) : []), [data]);

  useEffect(() => {
    savePrefillToStorage(prefillByNode);
  }, [prefillByNode]);

  const mappingForNode: NodePrefillState =
    selectedNodeId ? (prefillByNode[selectedNodeId] ?? {}) : {};

  // called when user chooses a source in the modal
  const setFieldMapping = (fieldKey: string, source: PrefillSource) => {
    if (!selectedNodeId) return;

    // safe immutable update
    setPrefillByNode((prev) => ({
      ...prev,
      [selectedNodeId]: {
        ...(prev[selectedNodeId] ?? {}),
        [fieldKey]: source,
      },
    }));
  };

  const clearFieldMapping = (fieldKey: string) => {
    if (!selectedNodeId) return;

    setPrefillByNode((prev) => ({
      ...prev,
      [selectedNodeId]: {
        ...(prev[selectedNodeId] ?? {}),
        [fieldKey]: null,
      },
    }));
  };

  if (isLoading) return <div>Loading blueprint graph...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data || !index) return <div>No graph data.</div>;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "420px 1fr",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* LEFT */}
        <section>
          <h1 style={{ margin: "0 0 8px" }}>Forms available</h1>
          <div style={{ fontStyle: "italic", opacity: 0.75, marginBottom: 12 }}>
            Form nodes (workflow steps)
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {nodes.map((node) => {
              const isSelected = node.id === selectedNodeId;

              return (
                <li key={node.id} style={{ marginBottom: 10 }}>
                  <button
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                      background: isSelected ? "#f2f2f2" : "white",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{getNodeLabel(node)}</div>
                    <div style={{ fontSize: 12, opacity: 0.65, fontFamily: "monospace" }}>
                      {node.id}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* RIGHT */}
        <section>
          {!selectedNodeId ? (
            <>
              <h1 style={{ margin: "0 0 8px" }}>Prefill</h1>
              <div style={{ opacity: 0.75 }}>Select a form node to configure prefill.</div>
            </>
          ) : (
            <PrefillPanel
              graph={data}
              index={index}
              selectedNodeId={selectedNodeId}
              mapping={mappingForNode}
              onSetMapping={setFieldMapping}
              onClearMapping={clearFieldMapping}
            />
          )}
        </section>
      </div>
    </div>
  );
}