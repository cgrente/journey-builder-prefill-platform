import { describe, expect, it } from "vitest";
import { buildGraphIndex } from "../graphIndex";
import { getAncestors, getDependencyDepths, getDirectParents } from "../traversal";
import type { BlueprintGraph, NodeId } from "../../model/types";

const graph: BlueprintGraph = {
  nodes: [
    { id: "form-F", type: "form", data: { component_id: "f_F" } },
    { id: "form-D", type: "form", data: { component_id: "f_D" } },
    { id: "form-E", type: "form", data: { component_id: "f_E" } },
    { id: "form-B", type: "form", data: { component_id: "f_B" } },
    { id: "form-C", type: "form", data: { component_id: "f_C" } },
    { id: "form-A", type: "form", data: { component_id: "f_A" } },
  ],
  edges: [
    { source: "form-D", target: "form-F" },
    { source: "form-E", target: "form-F" },
    { source: "form-B", target: "form-D" },
    { source: "form-A", target: "form-B" },
    { source: "form-A", target: "form-C" },
    { source: "form-C", target: "form-E" },
  ],
  forms: [
    { id: "f_A", name: "Form A" },
    { id: "f_B", name: "Form B" },
    { id: "f_C", name: "Form C" },
    { id: "f_D", name: "Form D" },
    { id: "f_E", name: "Form E" },
    { id: "f_F", name: "Form F" },
  ],
};

describe("blueprint graph traversal", () => {
  it("getDirectParents returns the direct parent nodes for Form F", () => {
    const index = buildGraphIndex(graph);
    const parents = getDirectParents(index, "form-F");
    expect(new Set(parents)).toEqual(new Set(["form-D", "form-E"]));
  });

  it("getAncestors returns all upstream nodes for Form F (direct + transitive)", () => {
    const index = buildGraphIndex(graph);
    const ancestors = getAncestors(index, "form-F");

    expect(ancestors).not.toContain("form-F"); // no self
    expect(new Set(ancestors)).toEqual(
      new Set(["form-D", "form-E", "form-B", "form-C", "form-A"])
    );
  });

  it ("getDependencyDepths returns correct depths for Form F", () => {
    const index = buildGraphIndex(graph);
    const depthMap = getDependencyDepths(index, "form-F");

    let direct: NodeId[] = [];
    let transitive: NodeId[] = [];

    for ( const [nodeId, depth] of depthMap) {
      if (depth === 1) {
        direct.push(nodeId);
      } else {
        transitive.push(nodeId)
      }
    }
    expect(direct).toEqual(["form-D", "form-E"])
    expect(transitive).not.toContain(["form-F"])
    expect(transitive).toEqual(["form-B", "form-C", "form-A"])
  });
});