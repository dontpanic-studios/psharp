import Env from "../runtime/env.ts";
import { MK_NUM, RuntimeValHandle } from "../runtime/valuelist.ts";

export function timeFunc(_args: RuntimeValHandle[], _env: Env) {
    return MK_NUM(Date.now());
}