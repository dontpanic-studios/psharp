import {
    BinaryExpr,
    Expr,
    Identifier,
    NumLit,
    Program,
    stmt,
    AssignmentExpr,
  } from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";
import { VarDelcleation } from "./ast.ts";

export default class Parser {
    private tokens: Token[] = [];

    private notEof(): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private at() {
        return this.tokens[0] as Token;
    }

    private EnhancedAtFunc() {
        const prev = this.tokens.shift() as Token;

        return prev;
    }

    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);

        const program: Program = {
          kind: "Program",
          body: [],
        };

        while (this.notEof()) {
            program.body.push(this.parseStmt());
        }
    
        return program;
    }

    private parseStmt() : stmt {
        // skip parse expr
        switch (this.at().type) {
            case TokenType.Set:
                return this.parseVarDeclare();
            case TokenType.Stuck:
                return this.parseVarDeclare();
            default:
                return this.parseExpr();
        }
    }

    parseVarDeclare(): stmt {
        const isConst = this.EnhancedAtFunc().type == TokenType.Stuck;
        const ident = this.expect(TokenType.Identifier, "couldn't found any identifier name after (set/stuck), ").value;

        if(this.at().type == TokenType.SemiColon) {
            this.EnhancedAtFunc();
            if(isConst) {
                throw "psharp.parser: must assign this value to stuck, no value provived.";
            }

            return { kind: "VarDelcleation", constant: false, id: ident } as VarDelcleation;
        }

        this.expect(TokenType.Equals, "equals token following id in var delclaration, ")
        const delcare = { kind: "VarDelcleation", id: ident, value: this.parseExpr(), constant: isConst } as VarDelcleation;

        this.expect(TokenType.SemiColon, "variable declaration statment must end with semicolon, ")
        return delcare;
    }

    private parseExpr() : Expr {
        return this.parseAssignExpr();
    }

    private parseAssignExpr(): Expr {
        const left = this.parseAdditExpr();

        if(this.at().type == TokenType.Equals) {
            this.EnhancedAtFunc();
            const value = this.parseAssignExpr();

            return { value, assign: left, kind: "AssignmentExpr" } as AssignmentExpr;
        }

        return left;
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
            const operator = this.EnhancedAtFunc().value;
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
            const operator = this.EnhancedAtFunc().value;
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
            case TokenType.Number: // handle num
                return { kind: "NumLit", value: parseFloat(this.EnhancedAtFunc().value) } as NumLit; 
            case TokenType.Identifier: // handle id
                return { kind: "Identifier", symbol: this.EnhancedAtFunc().value } as Identifier;
            case TokenType.OpenParen: { 
                this.EnhancedAtFunc();
                const val = this.parseExpr();
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