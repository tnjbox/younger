export class Protocol
{
  parse(line)
  {
    try { return JSON.parse(line); }
    catch(e) { return null; }
  }

  build(cmd)
  {
    return JSON.stringify({cmd});
  }
}