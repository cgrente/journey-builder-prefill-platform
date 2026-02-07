import { useMemo, useState } from "react";
import type { PrefillMapping, PrefillSource } from "../model/prefill";
import type { BlueprintGraph } from "../model/types";
import type { GraphIndex } from "../services/graphIndex";
import { getFieldsForNode } from "../services/fields";
import { getDependencyDepths, partitionDependencies, partitionDependenciesWithDepth } from "../services/traversal";
import { PrefillSourceModal } from "./PrefillSourceModal";

export function PrefillPanel({
  graph,
  index,
  selectedNodeId,
  mapping,
  onSetMapping,
  onClearMapping,
}: {
  graph: BlueprintGraph;
  index: GraphIndex;
  selectedNodeId: string;
  mapping: PrefillMapping;
  onSetMapping: (fieldKey: string, source: PrefillSource) => void;
  onClearMapping: (fieldKey: string) => void;
}) {
  //const { direct, transitive } = partitionDependencies(index, selectedNodeId);
  const { direct, transitive } = partitionDependenciesWithDepth(index, selectedNodeId);

  const fields = useMemo(
    () => getFieldsForNode(index, selectedNodeId),
    [index, selectedNodeId]
  );

  const depthMap = useMemo(
    () => getDependencyDepths(index, selectedNodeId),
    [index, selectedNodeId]
  );

  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);

  const labelOfSelectedForm = (id: string) => index.nodeById.get(id)?.data?.name ?? id;

  const openModalForField = (fieldKey: string) => {
    setActiveFieldKey(fieldKey);
  };

  const closeModal = () => setActiveFieldKey(null);

  const handleSelectSource = (source: PrefillSource) => {
    if (!activeFieldKey) return;
    onSetMapping(activeFieldKey, source);
    closeModal();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          {/* NOTE: you had marginTop: "%" which is invalid CSS; removed */}
          <div style={{ fontStyle: "italic", fontSize: 18, marginBottom: 4, opacity: 0.75 }}>
            Prefill fields for the selected form : <strong>{labelOfSelectedForm(selectedNodeId)}</strong>
          </div>
        </div>
      </div>

      {/* Fields list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {fields.length === 0 ? (
          <div style={{ color: "#666" }}>No fields found for this form.</div>
        ) : (
          fields.map((field) => {
            const source = mapping[field.key] ?? null;
            const isActive = activeFieldKey === field.key;

            return (
              <div
                key={field.key}
                role="button"
                tabIndex={0}
                onClick={() => openModalForField(field.key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") openModalForField(field.key);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: isActive ? "2px dashed #3b82f6" : "1px solid #d1d5db",
                  background: source ? "#f3f4f6" : "#f9fafb",
                  cursor: "pointer",
                }}
              >
                {/* left: field name */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ opacity: 0.7 }}>🗄️</span>
                  <span
                    style={{
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      fontSize: 13,
                      color: "#111",
                    }}
                  >
                    {field.key}
                  </span>
                </div>

                {/* right: mapping chip OR empty */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {source ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: "#e5e7eb",
                        color: "#111",
                        fontSize: 13,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>
                        {field.key}: <PrefillSourceLabel index={index} source={source} />
                      </span>
                      <button
                        type="button"
                        onClick={() => onClearMapping(field.key)}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          fontSize: 16,
                          color: "#666",
                        }}
                        aria-label={`Clear mapping for ${field.key}`}
                        title="Clear mapping"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>Click to map</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {activeFieldKey ? (
        <PrefillSourceModal
          depthMap={depthMap}
          graph={graph}
          index={index}
          targetNodeId={selectedNodeId}
          directNodeIds={direct}
          transitiveNodeIds={transitive}
          onSelect={handleSelectSource}
          onClose={closeModal}
        />
      ) : null}
    </div>
  );
}

function PrefillSourceLabel({ index, source }: { index: GraphIndex; source: PrefillSource }) {
  if (source.kind === "global") {
    return <span>{source.key}</span>;
  }
  const nodeLabel = index.nodeById.get(source.nodeId)?.data?.name ?? source.nodeId;
  return (
    <span>
      {nodeLabel}.{source.fieldKey}
    </span>
  );
}