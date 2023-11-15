/*
P# (PSharp Language)
Made in TypeScript, by DONT PAN!C STUDIOS.
*/

import Parser from "./src/parser.ts";

repl();

async function repl() {
     const parse = new Parser();

     console.log("P# Language\nhttps://studio.dontpanic.kro.kr/");

     while(true) {
        const input = prompt("> ");

        if(!input || input.includes("core.exit()")) {
            console.log("Exiting")
            Deno.exit(1);
        }

        const program = parse.produceAST(input);

        console.log(program);
     }
}