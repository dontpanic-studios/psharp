export type ValueTypes = "null" | "number";

export interface RuntimeValHandle {
    type: ValueTypes;
}

export interface NullValHandle extends RuntimeValHandle {
    type: "null";
    value: "null";
}

export interface NumValHandle extends RuntimeValHandle {
    type: "number";
    value: number;
}