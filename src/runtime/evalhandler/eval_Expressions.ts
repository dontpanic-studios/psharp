import { NumValHandle, ObjectValHandle, RuntimeValHandle } from "../valuelist.ts";
import { Identifier, BinaryExpr, AssignmentExpr, ObjectLit } from "../../ast.ts";
import { evalhandle } from "../interpreter.ts";
import Env from "../env.ts";
import { MK_NULL } from "../valuelist.ts";

export function evalNumBinExpr(lhs: NumValHandle, rhs: NumValHandle, operator: string): NumValHandle {
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

export function evalId(ident: Identifier, env: Env): RuntimeValHandle {
    const val = env.lookup(ident.symbol);
    return val;
}

export function evalBinExpr(binop: BinaryExpr, env: Env): RuntimeValHandle {
    const lefthandlein = evalhandle(binop.left, env);
    const righthandlein = evalhandle(binop.right, env);

    if(lefthandlein.type == "number" && righthandlein.type == "number") {
        return evalNumBinExpr(lefthandlein as NumValHandle, righthandlein as NumValHandle, binop.operator);
    }

    return MK_NULL();
}

export function evalAssign(node: AssignmentExpr, env: Env): RuntimeValHandle {
    if(node.assign.kind != "Identifier") {
        throw 'psharp.evalhandler.expression: invalid LeftHandShaker inside assignment expression: ' + JSON.stringify(node.assign);
    }
    
    const varname = (node.assign as Identifier).symbol;
    return env.assignVar(varname, evalhandle(node.value, env));
}

export function evalObjectExpr(obj: ObjectLit, env: Env): RuntimeValHandle {
    const object =  { type: "object", properties: new Map() } as ObjectValHandle;

    for (const { key, value } of obj.properties) {
        const runtimeVal = (value == undefined) ? env.lookup(key) : evalhandle(value, env);

        object.properties.set(key, runtimeVal);
    }
    
    return object;
}