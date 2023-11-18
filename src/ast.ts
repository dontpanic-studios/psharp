// deno-lint-ignore-file
export type NodeType =
  | "Program"
  | "NumLit"
  | "Identifier"
  | "BinaryExpr"
  | "VarDelcleation";

export interface stmt {
    kind: NodeType;
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

/*
func coolfunction() {

    // do something synbiL
}
*/