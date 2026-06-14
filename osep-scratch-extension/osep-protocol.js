import { STATE } from "./runtime-state.js";

export function updateState(data)
{
    if(data.btn)
        STATE.btn = data.btn;

    if(data.func !== undefined)
        STATE.func = data.func;

    if(data.mode !== undefined)
        STATE.mode = data.mode;
}