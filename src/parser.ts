import {
    BinaryExpr,
    Expr,
    Identifier,
    NumLit,
    Program,
    stmt,
    AssignmentExpr,
    Property,
    ObjectLit,
    CallFuncExpr,
    MemberExpr,
    FunctionDelc
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
            case TokenType.Func:
                return this.parseUsrFuncDelc();
            default:
                return this.parseExpr();
        }
    }

    parseUsrFuncDelc(): stmt {
      this.EnhancedAtFunc();
      const name = this.expect(TokenType.Identifier, 'expected function name following func').value;
      const args = this.parseArgs();
      //console.log(args);
      const params: string[] = [];

      for(const arg of args) {
        if(arg.kind != "Identifier") {
            console.log(arg);
            throw "psharp.parser: expected inside funcation declaration parameters to be of type 'string'.";
        }

        params.push((arg as Identifier).symbol);
      }

      this.expect(TokenType.OpenBrace, 'expected body before function');
      const body: stmt[] = [];

      while(this.at().type != TokenType.EOF && this.at().type != TokenType.CloseBrace) {
        body.push(this.parseStmt());
      }
      this.expect(TokenType.CloseBrace, 'expected closing brace inside function declaration');
      const func = {
        body, name, parameters: params, kind: "FunctionDelc"
      } as FunctionDelc;

      return func;
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
        const left = this.parseObjExpr();

        if(this.at().type == TokenType.Equals) {
            this.EnhancedAtFunc();
            const value = this.parseAssignExpr();

            return { value, assign: left, kind: "AssignmentExpr" } as AssignmentExpr;
        }

        return left;
    }

    private parseObjExpr(): Expr {
        if(this.at().type !== TokenType.OpenBrace) {
            return this.parseAdditExpr();
        }

        this.EnhancedAtFunc();
        const properties = new Array<Property>();

        while(this.notEof() && this.at().type != TokenType.CloseBrace) {
            const key = this.expect(TokenType.Identifier, 'object literal key exprected').value;
            
            if(this.at().type == TokenType.Comma) {
                this.EnhancedAtFunc();
                properties.push({key, kind: "Property", value: undefined} as Property);
                continue;
            } else if(this.at().type == TokenType.CloseBrace) {
                properties.push({key, kind: "Property"} as Property);
                continue;
            }

            this.expect(TokenType.Colon, "missing colon following identifier in objectexpr.");
            const value = this.parseExpr();

            properties.push({ kind: "Property", value, key });

            if(this.at().type != TokenType.CloseBrace) {
                this.expect(TokenType.Comma, "expected comma/closing barcket by following");
            }
        }

        this.expect(TokenType.CloseBrace, 'object literal missing');

        return { kind: "ObjectLit", properties } as ObjectLit;
    }
 
    // deno-lint-ignore no-explicit-any
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
        let left = this.parseCallMemberExpr();

        while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
            const operator = this.EnhancedAtFunc().value;
            const right = this.parseCallMemberExpr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parseCallMemberExpr(): Expr {
        const member = this.parseMemberExpr();

        if(this.at().type == TokenType.OpenParen) {
            return this.parseCallExpr(member);
        }

        return member;
    }

    private parseCallExpr(caller: Expr): Expr {
        // cool function tho
        let callExpr: Expr = {
            kind: "CallFuncExpr",
            caller,
            args: this.parseArgs(),
        } as CallFuncExpr;
        
        // hey, isn't this just loop?
        if (this.at().type == TokenType.OpenParen) {
            callExpr = this.parseCallExpr(callExpr);
        }

        return callExpr;
    }

    private parseArgs(): Expr[] {
        this.expect(TokenType.OpenParen, "expected open parent");
        const args = this.at().type == TokenType.CloseParen ? [] : this.parseArgumentList();
        this.expect(TokenType.CloseParen, "missing close parents.");

        return args;
    }

    private parseArgumentList(): Expr[] {
        const args = [this.parseAssignExpr()];

        while(this.notEof() && this.at().type == TokenType.Comma && this.EnhancedAtFunc()) {
            args.push(this.parseAssignExpr());
        }   

        return args;
    }

    private parseMemberExpr(): Expr {
        let object = this.parsePrim();

        while(this.at().type == TokenType.Dot || this.at().type == TokenType.OpenBracket) {
            const op = this.EnhancedAtFunc();
            let property: Expr;
            let computed: boolean;

            if(op.type == TokenType.Dot) {
                computed = false;
                property = this.parsePrim(); // note: this has to get identifier

                if(property.kind != "Identifier") {
                    throw "psharp.parser: cannot use dot op without right side handler being a id.";
                }
            } else {
                computed = true;
                property = this.parseExpr();
                this.expect(TokenType.CloseBracket, "missing closing bracket in computed value");
            }

            object = {
                kind: "MemberExpr",
                obj: object,
                property,
                computed,
            } as MemberExpr;
        }

        return object;
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