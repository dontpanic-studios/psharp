import { FunctionDelc, Program } from "../../ast.ts";
import { FuncValHandle, RuntimeValHandle } from "../valuelist.ts";
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

export function evalFuncDelc(declaration: FunctionDelc, env: Env): RuntimeValHandle {
    const func = {
        type: "func",
        name: declaration.name,
        parameters: declaration.parameters,
        delcenv: env,
        body: declaration.body,
    } as FuncValHandle;

    // define func
    return env.declareVar(declaration.name, func, true);
}