import {OSEPState} from "./osep-state.js";

export class OSEP_API
{
  static getButton(i)
  {
    return OSEPState.buttons[i] || 0;
  }

  static getAllButtons()
  {
    return OSEPState.buttons;
  }

  static isConnected()
  {
    return OSEPState.connected;
  }
}