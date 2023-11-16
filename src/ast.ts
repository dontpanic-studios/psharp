export type NodeType =
  | "Program"
  | "NumLit"
  | "NullLit"
  | "Identifier"
  | "BinaryExpr";


export interface stmt {
    kind: NodeType;
}

export interface Program extends stmt {
    kind: "Program";
    body: stmt[];
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

export interface NullLit extends Expr {
    kind: "NullLit";
    value: "null";
}

/*
func coolfunction() {

    // do something synbiL
}
*/