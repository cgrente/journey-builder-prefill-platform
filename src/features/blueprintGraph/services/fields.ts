import type { GraphIndex } from "./graphIndex";

export type FieldDescriptor = {
  key: string;
  title: string;
};

export function getFieldsForNode(index: GraphIndex, nodeId: string): FieldDescriptor[] {
  const formDefId = index.formDefinitionIdByNodeId.get(nodeId);
  if (!formDefId) return [];

  const formDef = index.formDefinitionById.get(formDefId);
  const fieldSchema: any = formDef?.field_schema;
  const props: Record<string, any> | undefined = fieldSchema?.properties;

  if (!props) return [];

  return Object.entries(props).map(([key, value]) => ({
    key,
    title: (value?.title as string) ?? key,
  }));
}