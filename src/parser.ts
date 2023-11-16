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
        return this.parseAdditExpr();
    }

    private expect(type: TokenType, err: any) {
        const prev = this.tokens.shift() as Token;

        if(!prev || prev.type != type) {
            console.error("psharp.parser: ", err, prev, "Expected: ", type);
            Deno.exit(1);
        }

        return prev;
    }

    private parseAdditExpr() : Expr {
        let left = this.parseMutilExpr();

        while (this.at().value == "+" || this.at().value == "-") {
            const operator = this.eh_at().value;
            const right = this.parseMutilExpr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parseMutilExpr() : Expr {
        let left = this.parsePrim();

        while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
            const operator = this.eh_at().value;
            const right = this.parsePrim();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }


    private parsePrim() : Expr {
        // parse current token
        const tk = this.at().type;

        switch(tk) {
            case TokenType.Number:
                return { kind: "NumLit", value: parseFloat(this.eh_at().value) } as NumLit; 
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eh_at().value } as Identifier;
            case TokenType.OpenParen: { 
                this.eh_at();
                const val = this.parse_expr();
                this.expect(TokenType.CloseParen, "psharp.parser: unexpected token found in expression, expected: ')'",);

                return val;
            }
            case TokenType.CloseParen:
            default:
                console.error("psharp.core: unexpeced token during parse, ", this.at());
                Deno.exit(1);
        }

    }
}