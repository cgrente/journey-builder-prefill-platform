# Architecture Overview

This document describes the architecture and design decisions of the Journey Builder Prefill Platform.
The goal of the project is to load a directed acyclic graph (DAG) of form nodes, display them as a list,
and allow users to configure *prefill mappings* between upstream and downstream form fields.

The project emphasizes:
- Clear separation of concerns
- Extensibility for future data sources
- Readable, testable business logic
- Minimal but intentional UI state management

---

## High-level Architecture

The application is split into **feature-scoped modules**, with one main feature:

```
src/features/blueprintGraph
```

This feature owns everything related to:
- Fetching the graph
- Traversing dependencies
- Displaying forms
- Managing prefill configuration

Shared UI components live under:

```
src/shared/ui
```

Global app bootstrapping remains in `src/app` and root-level files.

---

## Data Flow Overview

1. The graph is fetched via `getBlueprintGraph`
2. A normalized `GraphIndex` is built once per load
3. The user selects a form node
4. The prefill panel displays fields for the selected node
5. Prefill sources are resolved via pluggable providers
6. Prefill state is stored per-node in local React state

---

## Folder Structure (Key Parts)

```
src/
├─ features/
│  └─ blueprintGraph/
│     ├─ api/
│     │  └─ getBlueprintGraph.ts
│     ├─ components/
│     │  ├─ BlueprintGraphPage.tsx
│     │  ├─ PrefillPanel.tsx
│     │  └─ PrefillSourceModal.tsx
│     ├─ model/
│     │  ├─ types.ts
│     │  └─ prefill.ts
│     ├─ providers/
│     │  ├─ directDependencyFormsProvider.ts
│     │  ├─ transitiveDependencyFormsProvider.ts
│     │  ├─ globalDataProvider.ts
│     │  ├─ registry.ts
│     │  └─ types.ts
│     ├─ services/
│     │  ├─ graphIndex.ts
│     │  ├─ traversal.ts
│     │  ├─ fields.ts
│     │  ├─ selectors.ts
│     │  └─ __tests__/traversal.test.ts
│     └─ state/
│        └─ useBlueprintGraph.ts
├─ shared/
│  └─ ui/
│     └─ NavBar.tsx
```

---

## Core Concepts

### BlueprintGraph

Defined in `model/types.ts`, this mirrors the backend response shape and includes:
- Nodes
- Edges
- Form definitions

It is intentionally kept simple and close to the API contract.

---

### GraphIndex

Defined in `services/graphIndex.ts`.

This is a derived, in-memory index that provides:
- Fast parent/child lookups
- Node → form-definition mapping
- Centralized graph normalization

All traversal and lookup logic depends on this index instead of the raw graph.

---

### Traversal Logic

Located in `services/traversal.ts`.

Key functions:
- `getDirectParents`
- `getAncestors`
- `partitionDependencies`

These utilities are pure, deterministic, and unit-tested.

Tests live in:
```
services/__tests__/traversal.test.ts
```

---

## Prefill State Model

Defined in `model/prefill.ts`.

```ts
type PrefillStateByNode = Record<NodeId, NodePrefillState>
```

Each form node maintains its own independent prefill mapping.
Switching between nodes preserves state consistency.

---

## Prefill Providers (Extensibility Point)

Prefill sources are resolved via a **provider registry** pattern.

Each provider implements:

```ts
interface PrefillSourceProvider {
  id: string
  getGroups(...): SourceGroup[]
}
```

Current providers:
- Direct dependency forms
- Transitive dependency forms
- Global data

New providers can be added by registering them in:
```
providers/registry.ts
```
without modifying UI code.

---

## UI Components

### BlueprintGraphPage

- Owns selected node state
- Owns prefill state per node
- Passes mapping + callbacks to child components

Acts as the orchestration layer.

---

### PrefillPanel

- Displays fields for the selected node
- Renders current mappings
- Opens the source selection modal

This component is **stateless with respect to persistence** and relies on props.

---

### PrefillSourceModal

- Displays available prefill sources
- Groups sources by provider
- Emits selected source upward

The modal is purely presentational and easily replaceable.

---

## Styling

Styling is intentionally lightweight:
- Component-scoped CSS where needed
- Inline styles for layout clarity
- No dependency on external UI frameworks

This keeps the focus on logic rather than visuals.

---

## Testing Strategy

- Traversal logic is unit-tested
- Pure functions are preferred over hook-heavy logic
- UI behavior is verified manually due to scope constraints

---

## Design Trade-offs

- Local state was chosen over global state for clarity
- No persistence layer was added (out of scope)
- Styling favors clarity over completeness

---

## Summary

This architecture prioritizes:
- Readability
- Explicit data flow
- Easy extension of prefill sources
- Testable graph logic

The structure mirrors how a larger production system could scale,
while remaining approachable for a small coding challenge.
