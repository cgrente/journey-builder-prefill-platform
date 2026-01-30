import type { GraphIndex } from "./graphIndex";

export type FieldDescriptor = {
  key: string;
  title: string;
};

export function getFieldsForNode(index: GraphIndex, nodeId: string): FieldDescriptor[] {
  const formDefId = index.formDefinitionIdByNodeId.get(nodeId);
  if (!formDefId) return [];

  const formDef = index.formDefinitionById.get(formDefId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldSchema: any = formDef?.field_schema;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props: Record<string, any> | undefined = fieldSchema?.properties;

  if (!props) return [];

  return Object.entries(props).map(([key, value]) => ({
    key,
    title: (value?.title as string) ?? key,
  }));
}