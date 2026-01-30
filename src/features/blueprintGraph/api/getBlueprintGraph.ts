import type { BlueprintGraph } from "../model/types";

function buildBlueprintGraphUrl(): string {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const tenantId = import.meta.env.VITE_TENANT_ID;
  const blueprintId = import.meta.env.VITE_BLUEPRINT_ID;
  const blueprintVersionId = import.meta.env.VITE_BLUEPRINT_VERSION_ID;

  if (!baseUrl || !tenantId || !blueprintId || !blueprintVersionId) {
    throw new Error(
      "Missing required environment variables for blueprint graph API"
    );
  }

  return baseUrl + '/api/v1/' + tenantId + '/actions/blueprints/' + blueprintId + '/' + blueprintVersionId + '/graph';
}

export async function getBlueprintGraph(): Promise<BlueprintGraph> {
  const url = buildBlueprintGraphUrl();
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch blueprint graph (${response.status})`
    );
  }

  return (await response.json()) as BlueprintGraph;
}
