/*
P# (PSharp Language)
Made in TypeScript, by DONT PAN!C STUDIOS.
*/

import Parser from "./src/parser.ts";
import { evalhandle } from "./src/runtime/interpreter.ts";
import { NumValHandle } from "./src/runtime/valuelist.ts";
import Env from "./src/runtime/env.ts";

repl();

function repl() {
     const parse = new Parser();
     const env = new Env();

     env.declareVar('x', { value: 777, type: "number" } as NumValHandle);

     console.log("P# 1.0.0 (in deno)\nType 'core.exit()' or  'exit' to exit program.");

     while(true) {
        const input = prompt("> ");

        if(!input || input.includes("core.exit()") || input.includes("exit")) {
            console.log("Exiting")
            Deno.exit(0);
        }

        const program = parse.produceAST(input);

        const result = evalhandle(program, env);
        console.log(result);
     }
}