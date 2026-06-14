class OSEPTestExtension
{
    getInfo()
    {
        return {
            id: "oseptest",

            name: "OSEP Test",

            blocks: [
                {
                    opcode: "hello",

                    blockType: Scratch.BlockType.REPORTER,

                    text: "hello"
                }
            ]
        };
    }

    hello()
    {
        return "OSEP OK";
    }
}

Scratch.extensions.register(
    new OSEPTestExtension()
);
