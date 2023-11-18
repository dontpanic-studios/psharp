// deno-lint-ignore-file
import { RuntimeValHandle, NumValHandle } from './valuelist.ts';
import { stmt, NumLit, BinaryExpr, Program, Identifier } from '../ast.ts';
import Env from './env.ts';
import { VarDelcleation } from '../ast.ts';
import { evalPrgmExpr, evalVarDeclare } from './evalhandler/eval_Statements.ts';
import { evalId, evalBinExpr } from './evalhandler/eval_Expressions.ts';


export function evalhandle(astNode: stmt, env: Env): RuntimeValHandle {
    switch(astNode.kind) {
        case 'NumLit':
            return { value: ((astNode as NumLit).value), type: "number" } as NumValHandle;
        case "Identifier":
            return evalId(astNode as Identifier, env)
        case "BinaryExpr":
            return evalBinExpr(astNode as BinaryExpr, env);
        case "Program":
            return evalPrgmExpr(astNode as Program, env);
        case "VarDelcleation":
            return evalVarDeclare(astNode as VarDelcleation, env);
        default:
            console.error('psharp.interpret: ast not has not been setup for interpret,\n ', astNode)
            Deno.exit(0);
    }
}