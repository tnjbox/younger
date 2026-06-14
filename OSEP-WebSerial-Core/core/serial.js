export class SerialManager
{
  constructor()
  {
    this.port=null;
    this.reader=null;
    this.writer=null;
  }

  async connect()
  {
    this.port = await navigator.serial.requestPort();
    await this.port.open({baudRate:115200});

    this.writer = this.port.writable.getWriter();
    this.reader = this.port.readable.getReader();
  }

  async send(data)
  {
    if(!this.writer) return;

    await this.writer.write(
      new TextEncoder().encode(data+"\n")
    );
  }

  async read(callback)
  {
    let buffer="";

    while(true)
    {
      const {value,done} = await this.reader.read();
      if(done) break;

      buffer += new TextDecoder().decode(value);

      let lines = buffer.split("\n");
      buffer = lines.pop();

      for(let l of lines)
        callback(l.trim());
    }
  }
}