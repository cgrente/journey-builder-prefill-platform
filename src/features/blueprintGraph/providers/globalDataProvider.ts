import type { PrefillSourceProvider } from "./types";

export const globalDataProvider: PrefillSourceProvider = {
  id: "global-data",
  getGroups() {
    return [
      {
        title: "Global data",
        items: [
          { label: "Global: user.id", source: { kind: "global", key: "user.id" } as const },
          { label: "Global: tenant.id", source: { kind: "global", key: "tenant.id" } as const },
        ],
      },
    ];
  },
};