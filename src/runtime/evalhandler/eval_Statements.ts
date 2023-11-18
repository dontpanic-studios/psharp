import { Program } from "../../ast.ts";
import { RuntimeValHandle } from "../valuelist.ts";
import Env from "../env.ts";
import { MK_NULL } from "../valuelist.ts";
import { evalhandle } from "../interpreter.ts";
import { VarDelcleation } from "../../ast.ts";

export function evalPrgmExpr(program: Program, env: Env): RuntimeValHandle {
    let lastEvalVal: RuntimeValHandle = MK_NULL();

    for (const statement of program.body) {
        lastEvalVal = evalhandle(statement, env);
    }

    return lastEvalVal;
}

export function evalVarDeclare(declaration: VarDelcleation, env: Env): RuntimeValHandle {
    const value = declaration.value ? evalhandle(declaration.value, env) : MK_NULL();
    return env.declareVar(declaration.id, value, declaration.constant);
}