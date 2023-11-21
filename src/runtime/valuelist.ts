import { stmt } from "../ast.ts";
import Env from "./env.ts";
export type ValueTypes = "null" | "number" | "boolean" | "object" | "nativefunc" | "func";

export interface RuntimeValHandle {
    type: ValueTypes;
}
 
// handle null var
export interface NullValHandle extends RuntimeValHandle {
    type: "null";
    value: null;
}

export function MK_NULL() {
    return { type: "null", value: null } as NullValHandle;
}

// handle num
export interface NumValHandle extends RuntimeValHandle {
    type: "number";
    value: number;
}

export function MK_NUM(n = 0) {
    return { type: "number", value: n} as NumValHandle;
}

// handle bool
export interface BoolValHandle extends RuntimeValHandle {
    type: "boolean";
    value: boolean;
}

export function MK_BOOL(b = true) {
    return { type: "boolean", value: b} as BoolValHandle;
}

export interface ObjectValHandle extends RuntimeValHandle {
    type: "object";
    properties: Map<string, RuntimeValHandle>;
}

export type FuncCall = (args: RuntimeValHandle[], env: Env) => RuntimeValHandle

export interface NativeFuncValHandle extends RuntimeValHandle {
    type: "nativefunc";
    call: FuncCall;
}

export function MK_NATIVEFUNC(call: FuncCall) {
    return { type: "nativefunc", call} as NativeFuncValHandle;
}

export interface FuncValHandle extends RuntimeValHandle {
    type: "func";
    name: string;
    parameters: string[];
    delcenv: Env;
    body: stmt[];
}