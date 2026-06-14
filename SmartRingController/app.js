import {SerialManager} from "./core/serial.js";
import {Protocol} from "./core/protocol.js";
import {OSEP_UI} from "./core/osep-ui.js";
import {OSEPState} from "./core/osep-state.js";

const serial = new SerialManager();
const protocol = new Protocol();
const ui = new OSEP_UI();

// =========================
// 連線
// =========================

document.getElementById("connectBtn")
.onclick = async () =>
{
  try
  {
    await serial.connect();

    OSEPState.connected = true;
    ui.setConnected(true);

    serial.read((line)=>
    {
      const data = protocol.parse(line);

      if(!data) return;

      if(data.btn)
      {
        ui.updateButtons(data.btn);
        ui.updateDebug(data);
      }
    });
  }
  catch(e)
  {
    alert("連線失敗：" + e.message);
  }
};

// =========================
// OSEP 全域API（給未來Scratch用）
// =========================

window.OSEP =
{
  send:(cmd)=>serial.send(protocol.build(cmd))
};