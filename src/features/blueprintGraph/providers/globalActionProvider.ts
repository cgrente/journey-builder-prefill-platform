import type { PrefillSourceProvider  } from "./types";

export const globalActionProvider: PrefillSourceProvider = {
  id: "global-action",
  getGroups() {
    return [
      {
        title: "Action properties",
        items: [
          { label: "Global: action.id", source: { kind: "global", key: "action.id" } as const },
          { label: "Global: action.createdAt", source: { kind: "global", key: "action.createdAt" } as const },
          { label: "Global: environment.name", source: { kind: "global", key: "env.name" } as const },
        ],
      },
    ];
  },
};