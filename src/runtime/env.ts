/*
psharp - environment script
*/

import { timeFunc } from "../function/curdate.ts";
import { MK_NATIVEFUNC, RuntimeValHandle } from "./valuelist.ts";
import { MK_BOOL, MK_NULL } from "./valuelist.ts";

export function setupGlobalScope() {
    const env = new Env();

    env.declareVar('true', MK_BOOL(true), true);
    env.declareVar('null', MK_NULL(), true);
    env.declareVar('false', MK_BOOL(false), true);

    // def native func ex) prtln
    env.declareVar('prtln', MK_NATIVEFUNC((args, scope) => {
        //console.debug('psharp.env: returning value');
        console.log(...args);
        return MK_NULL();
    }), true);

    env.declareVar('now', MK_NATIVEFUNC(timeFunc), true);

    return env;
}

export default class Env {
    private parent?: Env;
    private varibs: Map<string, RuntimeValHandle>;
    private constants: Set<string>;

    constructor (parentENV?: Env) {
        const global = parentENV ? true : false;

        this.parent = parentENV;
        this.varibs = new Map();
        this.constants = new Set();

    }

    public declareVar (varname: string, value: RuntimeValHandle, constant: boolean): RuntimeValHandle {
        if(this.varibs.has(varname)) {
            throw "psharp.env: cannot declare variable: " + varname +", because it already declared.";
        }

        this.varibs.set(varname, value);
        if(constant) {
            this.constants.add(varname);
        }
        return value;
    }

    public assignVar (varname: string, value: RuntimeValHandle): RuntimeValHandle {
        const env = this.resolve(varname);
        if(env.constants.has(varname)) {
            throw new Error("psharp.env: cannot assign " + varname + " as it was declared constant.");
        }
        env.varibs.set(varname, value);
        return value;
    }

    public resolve(varname: string): Env {
        if(this.varibs.has(varname)) {
            return this;
        }

        if(this.parent == undefined) {
            throw "psharp.env: cannot resolve: " + varname + ", because it doesn't exist."
        }

        return this.parent.resolve(varname);
    }

    public lookup(varname: string): RuntimeValHandle {
        const env = this.resolve(varname);
        return env.varibs.get(varname) as RuntimeValHandle;
    }
}