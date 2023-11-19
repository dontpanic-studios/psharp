export type ValueTypes = "null" | "number" | "boolean" | "object";

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