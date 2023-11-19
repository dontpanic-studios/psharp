/*
P# (PSharp Language)
Made in TypeScript, by DONT PAN!C STUDIOS.
*/

import Parser from "./src/parser.ts";
import { evalhandle } from "./src/runtime/interpreter.ts";
import { MK_NUM, MK_NULL, MK_BOOL } from "./src/runtime/valuelist.ts";
import Env from "./src/runtime/env.ts";

repl();

function repl() {
     const parse = new Parser();
     const env = new Env();
    
    // setup default variables
     env.declareVar('psharptestvar', MK_NUM(100), true);
     env.declareVar('true', MK_BOOL(true), true);
     env.declareVar('null', MK_NULL(), true);
     env.declareVar('false', MK_BOOL(false), true);

     console.log("P# 1.0.0 (in deno)\nType 'core.exit()' or 'exit' to exit program.");

     while(true) { // main function
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