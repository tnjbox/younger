export class OSEPBridge
{
  constructor()
  {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.buffer = "";
  }

  async connect()
  {
    this.port = await navigator.serial.requestPort();
    await this.port.open({ baudRate: 115200 });

    this.writer = this.port.writable.getWriter();
    this.reader = this.port.readable.getReader();
  }

  async send(obj)
  {
    const msg = JSON.stringify(obj) + "\n";
    await this.writer.write(new TextEncoder().encode(msg));
  }

  async startRead(callback)
  {
    while(true)
    {
      const { value, done } = await this.reader.read();
      if(done) break;

      this.buffer += new TextDecoder().decode(value);

      let lines = this.buffer.split("\n");
      this.buffer = lines.pop();

      for(let line of lines)
      {
        try
        {
          callback(JSON.parse(line));
        }
        catch(e) {}
      }
    }
  }
}