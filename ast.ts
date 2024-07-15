export type NodeType =
    | "Program" 
    | "NumericLiteral" 
    | "Identifier" 
    | "BinaryExpr";

//In IshanScript only expression return value
//"let x = 45" is a statement and is therefore Undefined
//"x = 45" is an expression and has a value where x is 45 
    export interface Stmt {
    kind: NodeType;
}

export interface Program extends Stmt {
    kind: "Program", 
    body: Stmt[];
}

export interface Expr extends Stmt {}

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

export interface NumericLiteral extends Expr {
    kind: "NumericLiteral";
    value: number;
}
