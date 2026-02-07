import type { PrefillSource } from "../model/prefill";
import type { BlueprintGraph, NodeId } from "../model/types";
import type { GraphIndex } from "../services/graphIndex";
import { prefillSourceProviders } from "../providers/registry";
import { useEffect } from "react";
import { getCurrentUrl, type DependencyType } from "../../../shared/utils/urlTools";


type SourceItem = {
  label: string;
  source: PrefillSource;
};

type SourceGroup = {
  title: string;
  items: SourceItem[];
};


type HiddenSection = "direct" | "transitive" | "global";

function getHiddenSections(depType: DependencyType): Set<HiddenSection> {
  switch (depType) {
    case "direct":
      return new Set<HiddenSection>(["transitive", "global"]);
    case "transitive":
      return new Set<HiddenSection>(["direct", "global"]);
    case "global":
      return new Set<HiddenSection>(["direct", "transitive"]);
    case "all":
    default:
      return new Set<HiddenSection>();
  }
}

export function PrefillSourceModal({
  depthMap,
  graph,
  index,
  targetNodeId,
  directNodeIds,
  transitiveNodeIds,
  onSelect,
  onClose,
}: {
  depthMap: Map<NodeId, number>
  graph: BlueprintGraph;
  index: GraphIndex;
  targetNodeId: string;
  directNodeIds: string[];
  transitiveNodeIds: string[];
  onSelect: (source: PrefillSource) => void;
  onClose: () => void;
}) {
  const labelOf = (id: string) => index.nodeById.get(id)?.data?.name ?? id;

  const groups: SourceGroup[] = prefillSourceProviders.flatMap((providers) =>
    providers.getGroups({ graph, index, targetNodeId, directNodeIds, transitiveNodeIds, depthMap})
  );

  const dependencyType = getCurrentUrl();
  const hidden = getHiddenSections(dependencyType);

  const visibleGroups = groups.filter((group) => {
    if (group.items.length === 0) return false;

    const t = group.title.toLowerCase();
    if (t.includes("direct dependency") && hidden.has("direct")) return false;
    if (t.includes("transitive dependency") && hidden.has("transitive")) return false;

    return true;
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape")
        onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "grid",
        placeItems: "center",
        padding: 24,
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 760,
          maxWidth: "100%",
          background: "#fff",
          color: "#111",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Select data element to map</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                Target: <strong>{labelOf(targetNodeId)}</strong>
              </div>
            </div>
          </div>
          

          <div style={{ padding: 16, maxHeight: "70vh", overflow: "auto" }}>
            {visibleGroups.length === 0 ? (
              <div style={{ color: "#6b7280" }}>No sources available.</div>
            ) : (
              visibleGroups.map((group) => (
                <Section key={group.title} title={group.title} items={group.items} onSelect={onSelect} />
              ))
            )}
          </div>
        {/* Footer */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              border: "1px solid #d1d5db",
              background: "#fff",
              borderRadius: 8,
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: Array<{ label: string; source: PrefillSource }>;
  onSelect: (source: PrefillSource) => void;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{title}</div>

      {items.length === 0 ? (
        <div style={{ fontSize: 12, color: "#6b7280" }}>None</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item) => (
            <button
              key={`${title}-${item.label}`}
              type="button"
              onClick={() => onSelect(item.source)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                background: "#f9fafb",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 13 }}>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}