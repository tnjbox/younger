import {OSEPState} from "./osep-state.js";

export class OSEP_UI
{
  constructor()
  {
    this.pad = document.getElementById("pad");
    this.debug = document.getElementById("debug");

    this.createPad();
  }

  // =========================
  // 建立按鈕UI（可共用）
  // =========================

  createPad()
  {
    const labels = ["F","B","L","R","U","D","O","C"];

    this.pad.classList.add("pad-grid");

    this.buttons=[];

    for(let i=0;i<8;i++)
    {
      let div=document.createElement("div");
      div.className="pad-btn";
      div.innerText=labels[i];

      this.pad.appendChild(div);
      this.buttons.push(div);
    }
  }

  // =========================
  // 更新按鈕狀態
  // =========================

  updateButtons(arr)
  {
    OSEPState.buttons = arr;

    for(let i=0;i<8;i++)
    {
      if(arr[i])
        this.buttons[i].classList.add("active");
      else
        this.buttons[i].classList.remove("active");
    }
  }

  // =========================
  // Debug JSON
  // =========================

  updateDebug(json)
  {
    this.debug.textContent =
      JSON.stringify(json,null,2);
  }

  // =========================
  // 連線狀態
  // =========================

  setConnected(state)
  {
    const dot = document.getElementById("statusDot");
    const text = document.getElementById("statusText");

    if(state)
    {
      dot.classList.add("connected");
      text.textContent="Connected";
    }
    else
    {
      dot.classList.remove("connected");
      text.textContent="Disconnected";
    }
  }
}