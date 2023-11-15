import {
    BinaryExpr,
    Expr,
    Identifier,
    NumLit,
    Program,
    stmt,
  } from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";

export default class Parser {
    private tokens: Token[] = [];

    private not_eof (): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private at () {
        return this.tokens[0] as Token;
    }

    private eh_at() {
        const prev = this.tokens.shift() as Token;

        return prev;
    }

    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);

        const program: Program = {
          kind: "Program",
          body: [],
        };

        while (this.not_eof()) {
            program.body.push(this.parse_stmt());
        }
    
        return program;
    }

    private parse_stmt () : stmt {
        // skip parse expr
        return this.parse_expr();
    }

    private parse_expr() : Expr {
        return this.parse_prim_expr();
    }

    private parse_prim_expr() : Expr {
        // parse current token
        const tk = this.at().type;

        switch(tk) {
            case TokenType.Number:
                return { kind: "NumLit", value: parseFloat(this.eh_at().value) } as NumLit; 
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eh_at().value } as Identifier; 
            default:
                console.error("psharp.core: unexpeced token during parse, ", this.at());
                Deno.exit(1);
        }

    }
}