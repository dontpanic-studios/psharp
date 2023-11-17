// deno-lint-ignore-file
import { RuntimeValHandle, NumValHandle, NullValHandle } from './valuelist.ts';
import { stmt, NumLit, BinaryExpr, Program, Identifier } from '../ast.ts';
import Env from './env.ts';
import { MK_NULL } from './valuelist.ts';

function evalPrgmExpr(program: Program, env: Env): RuntimeValHandle {
    let lastEvalVal: RuntimeValHandle = MK_NULL();

    for (const statement of program.body) {
        lastEvalVal = evalhandle(statement, env);
    }

    return lastEvalVal;
}

function evalNumBinExpr(lhs: NumValHandle, rhs: NumValHandle, operator: string): NumValHandle {
    let num: number;
    
    if(operator == "+") {
        num = lhs.value + rhs.value;
    } else if (operator == "-") {
        num = lhs.value - rhs.value;
    } else if (operator == "/") {
        num = lhs.value / rhs.value;
    } else if (operator == "*") {
        num = lhs.value * rhs.value;
    } else {
        num = lhs.value % rhs.value;
    }

    return { value: num, type: "number" };
}

function evalId(ident: Identifier, env: Env): RuntimeValHandle {
    const val = env.lookup(ident.symbol);
    return val;
}

function evalBinExpr(binop: BinaryExpr, env: Env): RuntimeValHandle {
    const lefthandlein = evalhandle(binop.left, env);
    const righthandlein = evalhandle(binop.right, env);

    if(lefthandlein.type == "number" && righthandlein.type == "number") {
        return evalNumBinExpr(lefthandlein as NumValHandle, righthandlein as NumValHandle, binop.operator);
    }

    return MK_NULL();
}

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
        default:
            console.error('psharp.interpret: ast not has not been setup for interpret,\n ', astNode)
            Deno.exit(0);
    }
}