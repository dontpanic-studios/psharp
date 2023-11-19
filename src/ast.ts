// deno-lint-ignore-file
export type NodeType =
  | "Program"
  | "NumLit"
  | "Identifier"
  | "BinaryExpr"
  | "AssignmentExpr"
  | "VarDelcleation"
  | "Property"
  | "ObjectLit";

export interface stmt {
    kind: NodeType;
}

export interface AssignmentExpr extends Expr {
    kind: "AssignmentExpr";
    assign: Expr;
    value: Expr;
}

export interface Program extends stmt {
    kind: "Program";
    body: stmt[];
}

export interface VarDelcleation extends stmt {
    kind: "VarDelcleation";
    constant: boolean;
    id: string;
    value?: Expr;
}

export interface Expr extends stmt {}

export interface BinaryExpr extends Expr {
    kind: "BinaryExpr";
    left: Expr;
    right: Expr;
    operator: string;
}

export interface Identifier extends Expr {
    kind: "Identifier";
    symbol: string;
}

export interface NumLit extends Expr {
    kind: "NumLit";
    value: number;
}

export interface ObjectLit extends Expr {
    kind: "ObjectLit";
    properties: Property[];
}

export interface Property extends Expr {
    kind: "Property";
    key: string;
    value?: Expr;
}
