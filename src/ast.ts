export type NodeType = "Program" | "NumLit" | "BinaryExpr" | "CallExpr" | "UnaryExpr" | "Id" | "FunctionDeclar";

export interface stmt {
    kind: NodeType;
}

export interface Program extends stmt {
    kind: "Program";
    body: stmt[];
}