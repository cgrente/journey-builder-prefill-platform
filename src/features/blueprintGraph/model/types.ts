export type NodeId = string;
export type FormDefinitionId = string;

export type GraphEdge = {
    source: NodeId;
    target: NodeId;
};

export type GraphNode = {
    id: NodeId;
    type: string;
    data?: {
        component_id?: FormDefinitionId; // maps node -> form definition
        component_key?: NodeId;          // usually same as node.id
        name?: string;                   // human name of node
        prerequisites?: NodeId[];        // optional (edges already represent this)
    };
};

export type BlueprintGraph = {
    id?: string;
    name?: string;
    nodes?: GraphNode[];
    edges?: GraphEdge[];
    forms?: FormDefinition[];

};

export type FormDefinition = {
  id: FormDefinitionId;
  name: string;
  field_schema?: any;
};
