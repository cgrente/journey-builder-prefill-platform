export type Edge = {
    source: string;
    target: string;
};

export type Form = {
    id: string;
    name: string;
};

export type Node = {
    id: string;
    type: string;
};

export type BlueprintGraph = {
    blueprint_id?: string;
    blueprint_name?: string;
    nodes?: Node[];
    edges?: Edge[];
    forms?: Form[];
};