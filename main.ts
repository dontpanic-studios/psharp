/*
P# (PSharp Language)
Made in TypeScript, by DONT PAN!C STUDIOS.
*/

const isSeparator = (value: string): boolean => value === '/'|| value === '\\' || value === ':';
const getExtension = (path: string): string => {
    for (let i = path.length - 1; i > -1; --i) {
        const value = path[i];
        if (value === '.') {
            if (i > 1) {
                if (isSeparator(path[i - 1])) {
                    return '';
                }
                return path.substring(i + 1);
            }
            return '';
        }
        if (isSeparator(value)) {
            return '';
        }
    }
    return '';
};

import Parser from "./src/parser.ts";
import { evalhandle } from "./src/runtime/interpreter.ts";
import { setupGlobalScope } from "./src/runtime/env.ts";

initrun('.\\src\\example.ps')

async function initrun(filename: string) {
    const ver = 'v1.0.0';
    const parser = new Parser();
    const env = setupGlobalScope();

    console.log("psharp.log: Running P# " + ver + " interpreter.")

    if(getExtension(filename) == 'ps') {
        const input = await Deno.readTextFile(filename);
        const program = parser.produceAST(input);
        const result = evalhandle(program, env);
    
        console.log(result);
    } else {
        console.error("psharp.core: PSharp Interpreter only supports '.ps' file extension.");
    }
}

/*
function repl() {
     const parse = new Parser();
     const env = setupGlobalScope();
    
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
*/