import {OSEP_STATE} from "./runtime-state.js";

export function updateState(data)
{
  if(data.btn)
    OSEP_STATE.btn = data.btn;

  if(data.func !== undefined)
    OSEP_STATE.func = data.func;

  if(data.mode !== undefined)
    OSEP_STATE.mode = data.mode;
}