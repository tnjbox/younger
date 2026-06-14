import { STATE } from "./runtime-state.js";

class OSEP
{
    getInfo()
    {
        return {
            id: "osep_v22b",

            name: "OSEP V2.2-B",

            blocks:
            [
                {
                    opcode: "btn",
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: "button [ID] pressed",
                    arguments:
                    {
                        ID:
                        {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },

                {
                    opcode: "func",
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: "function key pressed"
                },

                {
                    opcode: "connected",
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: "ESP connected"
                }
            ]
        };
    }

    btn(args)
    {
        return STATE.btn[args.ID] === 1;
    }

    func()
    {
        return STATE.func === 1;
    }

    connected()
    {
        return STATE.connected;
    }
}

Scratch.extensions.register(new OSEP());
