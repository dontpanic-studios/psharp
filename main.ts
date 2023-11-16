/*
P# (PSharp Language)
Made in TypeScript, by DONT PAN!C STUDIOS.
*/

import Parser from "./src/parser.ts";
import { evalhandle } from "./src/runtime/interpreter.ts";

repl();

function repl() {
     const parse = new Parser();

     console.log("P# 1.0.0 (in deno)\nType 'core.exit()' to exit program.");

     while(true) {
        const input = prompt("> ");

        if(!input || input.includes("core.exit()")) {
            console.log("Exiting")
            Deno.exit(1);
        }

        const program = parse.produceAST(input);

        const result = evalhandle(program);
        console.log(result);
     }
}