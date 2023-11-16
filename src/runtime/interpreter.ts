// deno-lint-ignore-file
import { RuntimeValHandle, NumValHandle, NullValHandle } from './valuelist.ts';
import { stmt, NumLit, BinaryExpr, Program } from '../ast.ts';

function evalPrgmExpr(program: Program): RuntimeValHandle {
    let lastEvalVal: RuntimeValHandle = { type: "null", value: "null" } as NullValHandle;

    for (const statement of program.body) {
        lastEvalVal = evalhandle(statement);
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

function evalBinExpr(binop: BinaryExpr): RuntimeValHandle {
    const lefthandlein = evalhandle(binop.left);
    const righthandlein = evalhandle(binop.right);

    if(lefthandlein.type == "number" && righthandlein.type == "number") {
        return evalNumBinExpr(lefthandlein as NumValHandle, righthandlein as NumValHandle, binop.operator);
    }

    return { type: "null", value: "null" } as NullValHandle;
}

export function evalhandle(astNode: stmt): RuntimeValHandle {
    switch(astNode.kind) {
        case 'NumLit':
            return { value: ((astNode as NumLit).value), type: "number" } as NumValHandle;
        case "NullLit":
                return { value: "null", type: "null" } as NullValHandle;
        case "BinaryExpr":
            return evalBinExpr(astNode as BinaryExpr);
        case "Program":
            return evalPrgmExpr(astNode as Program);
        default:
            console.error('psharp.interpret: ast not has not been setup for interpret,\n ', astNode)
            Deno.exit(0);
    }
}