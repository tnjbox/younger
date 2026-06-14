import { STATE } from "./runtime-state.js";

export class OSEPBridge
{
    constructor()
    {
        this.port = null;
        this.reader = null;
        this.buffer = "";
    }

    async connect(callback)
    {
        this.port = await navigator.serial.requestPort();

        await this.port.open({
            baudRate:115200
        });
		
		STATE.connected = true;

        this.reader = this.port.readable.getReader();

        while(true)
        {
            const {value,done} = await this.reader.read();

            if(done) {
				
				STATE.connected = false;
				break;
			}

            this.buffer += new TextDecoder().decode(value);

            let lines = this.buffer.split("\n");

            this.buffer = lines.pop();

            for(let line of lines)
            {
                try
                {
                    callback(JSON.parse(line));
                }
                catch(e)
                {
                    console.log("JSON Error",line);
                }
            }
        }
    }
}
