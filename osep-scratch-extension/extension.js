import {OSEPBridge} from "./osep-bridge.js";
import {OSEP_STATE} from "./runtime-state.js";
import {updateState} from "./osep-protocol.js";

const bridge = new OSEPBridge();

class OSEP_Scratch_Extension
{
  getInfo()
  {
    return {
      id: "osep_v2",
      name: "OSEP ESP8266 Controller",
      blocks:
      [
        {
          opcode: "connect",
          blockType: Scratch.BlockType.COMMAND,
          text: "connect ESP8266"
        },

        {
          opcode: "isPressed",
          blockType: Scratch.BlockType.BOOLEAN,
          text: "button [INDEX] pressed",
          arguments:
          {
            INDEX:
            {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0
            }
          }
        },

        {
          opcode: "functionKey",
          blockType: Scratch.BlockType.BOOLEAN,
          text: "function key pressed"
        },

        {
          opcode: "setLED",
          blockType: Scratch.BlockType.COMMAND,
          text: "set LED [COLOR]",
          arguments:
          {
            COLOR:
            {
              type: Scratch.ArgumentType.STRING,
              menu: "colors"
            }
          }
        }
      ],

      menus:
      {
        colors:
        {
          items:["RED","GREEN","BLUE","WHITE","OFF"]
        }
      }
    };
  }

  // =========================
  // 連線
  // =========================

  async connect()
  {
    await bridge.connect();

    bridge.startRead((data)=>
    {
      updateState(data);
    });

    return "connected";
  }

  // =========================
  // 按鍵讀取
  // =========================

  isPressed(args)
  {
    return OSEP_STATE.btn[args.INDEX] === 1;
  }

  // =========================
  // 功能鍵（D0）
  // =========================

  functionKey()
  {
    return OSEP_STATE.func === 1;
  }

  // =========================
  // LED控制
  // =========================

  setLED(args)
  {
    bridge.send({cmd:args.COLOR});
  }
}

Scratch.extensions.register(new OSEP_Scratch_Extension());