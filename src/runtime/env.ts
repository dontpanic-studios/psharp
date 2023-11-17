/*
psharp - environment script
*/

import { RuntimeValHandle } from "./valuelist.ts";

export default class Env {

    private parent?: Env;
    private varibs: Map<string, RuntimeValHandle>;

    constructor (parentENV?: Env) {
        this.parent = parentENV;
        this.varibs = new Map();
    }

    public declareVar (varname: string, value: RuntimeValHandle): RuntimeValHandle {
        if(this.varibs.has(varname)) {
            throw "psharp.env: cannot declare variable: " + varname +", because it already declared.";
        }

        this.varibs.set(varname, value);
        return value;
    }

    public assignVar (varname: string, value: RuntimeValHandle): RuntimeValHandle {
        const env = this.resolve(varname);
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