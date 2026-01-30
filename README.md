# Journey Builder Prefill Platform

A React + TypeScript implementation of the “Journey Builder” take-home challenge.  
The goal is to fetch and display an Action Blueprint graph (a DAG of forms) and implement a UI to configure prefill mappings between forms.

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

This project is designed to work with the provided mock server.

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
VITE_BASE_URL=
VITE_TENANT_ID=
VITE_BLUEPRINT_ID=
VITE_BLUEPRINT_VERSION_ID=
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
- Builds an indexed representation of the graph for efficient traversal
- Renders a list of form nodes
- Allows selecting a form to configure its prefill mappings
- Displays form fields and existing prefill configuration
- Supports clearing and editing field mappings
- Opens a modal to select a prefill source
  - Direct dependency form fields
  - Transitive dependency form fields
  - Global data
- Prefill state is scoped per form node


## Project structure (high level)

```
src/
  features/
    blueprintGraph/
      api/        # API calls
      model/      # Domain types
      services/   # Graph index, traversal, selectors
      providers/  # Pluggable prefill source providers
      state/      # Feature state (graph loading)
      components/ # UI components (panel, modal)
  shared/
    ui/
```

## Design notes

- Feature-based structure keeps graph, traversal, and prefill logic scoped together
- Graph traversal (direct vs transitive dependencies) is isolated in services
- Prefill sources are implemented via a provider registry for easy extension
- UI components are kept declarative and state is lifted where appropriate
- Types model only the parts of the API that are actually used

## Scripts

```bash
pnpm dev        # start dev server
pnpm lint       # run eslint
pnpm typecheck  # type-check with tsc
pnpm test       # tests (to be added)
```
