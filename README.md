# Journey Builder Prefill Platform

A React + TypeScript implementation of the “Journey Builder” take-home challenge.  
The goal is to fetch and display an Action Blueprint graph (a DAG of forms) and serve as the foundation for building a form prefill mapping UI.

## Tech stack

- React 18
- TypeScript
- Vite
- pnpm

## Prerequisites

- Node.js 18+
- pnpm
- npm (for running the mock server)

## Run locally

### 1) Start the mock server

This project is designed to work with the Avantos mock server.

If the mock server lives inside this repo:

```bash
cd mock-server
npm install
npm start
```

The server should be available at:
```
http://localhost:3000
```

### 2) Configure environment variables

Create a `.env` file at the project root:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_TENANT_ID=123
VITE_BLUEPRINT_ID=bp_456
```

> Note: `.env` is intentionally not committed. Adjust values as needed.

### 3) Start the app

From the project root:

```bash
pnpm install
pnpm dev
```

Open:
```
http://localhost:5173
```

## What’s implemented so far

- Fetches the blueprint graph from the mock server
- Handles loading and error states via a small custom hook
- Renders a list of forms (name + id)

This provides a clean vertical slice before introducing more complex UI and DAG traversal logic.

## Project structure (high level)

```
src/
  features/
    blueprintGraph/
      api/        # API calls (fetch blueprint graph)
      model/      # Minimal domain types
      state/      # Feature state (loading/error/data)
      components/ # UI components
  shared/
    hooks/
    ui/
    utils/
```

## Design notes

- Feature-based structure keeps domain logic isolated and easy to extend
- Data fetching is centralized in a small hook (`useBlueprintGraph`)
- UI components remain “dumb” and declarative
- Types are intentionally minimal: only what is needed at each step

## Next steps

Planned extensions:

- Graph traversal utilities to compute direct vs transitive dependencies
- Prefill mapping UI and selection modal
- Pluggable data sources (form fields, globals, etc.)
- Focused unit tests for graph traversal and providers

## Scripts

```bash
pnpm dev        # start dev server
pnpm lint       # run eslint
pnpm typecheck  # type-check with tsc
pnpm test       # tests (to be added)
```
