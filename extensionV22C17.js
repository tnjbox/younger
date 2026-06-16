(function(Scratch) {

    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error("OSEP requires unsandboxed mode");
    }

    const LED_COUNT = 12;
    const MAX_LED_VALUE = 30;

    // =====================================================
    // V2.2-C17：WebSerial 通訊延遲
    // -----------------------------------------------------
    // 實測 WS2812 控制指令連續送出時，約需 5ms 緩衝時間。
    // 因此所有「會送資料到 ESP8266」的積木，都由 Extension
    // 內部自動等待，不需要學生另外放 Scratch 等待積木。
    // =====================================================
    const COMMUNICATION_DELAY_MS = 5;

    const STATE = {
        btn:[0,0,0,0,0,0,0],
        prevBtn:[0,0,0,0,0,0,0],
        down:[0,0,0,0,0,0,0],
        release:[0,0,0,0,0,0,0],
        click:[0,0,0,0,0,0,0],
        func:0,
        mode:0,
        connected:false,

        ledBuffer:[
            [0,0,0],[0,0,0],[0,0,0],
            [0,0,0],[0,0,0],[0,0,0],
            [0,0,0],[0,0,0],[0,0,0],
            [0,0,0],[0,0,0],[0,0,0]
        ],

        loopVars:{},
        animationTimer:null,
        animationName:"NONE"
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function limitLEDValue(value) {
        value = Number(value);
        if(isNaN(value)) value = 0;
        value = Math.round(value);
        if(value < 0) value = 0;
        if(value > MAX_LED_VALUE) value = MAX_LED_VALUE;
        return value;
    }

    function limitLEDIndex(index) {
        index = Number(index);
        if(isNaN(index)) index = 1;
        index = Math.round(index);
        if(index < 1) index = 1;
        if(index > LED_COUNT) index = LED_COUNT;
        return index;
    }

    function copyColor(rgb) {
        return [
            Number(rgb[0]) || 0,
            Number(rgb[1]) || 0,
            Number(rgb[2]) || 0
        ];
    }

    function setScratchVariable(util, name, value) {
        try {
            const variable = util.target.lookupVariableByNameAndType(name, "");
            if(variable) variable.value = value;
        } catch(e) {}
    }

    function colorToRGB(color) {
        const name = String(color || "RED").toUpperCase();

        if(name === "RED") return [30,0,0];
        if(name === "GREEN") return [0,30,0];
        if(name === "BLUE") return [0,0,30];
        if(name === "WHITE") return [30,30,30];
        if(name === "YELLOW") return [30,20,0];
        if(name === "PURPLE") return [20,0,30];
        if(name === "CYAN") return [0,25,25];
        if(name === "ORANGE") return [30,10,0];
        if(name === "PINK") return [30,0,15];
        if(name === "OFF") return [0,0,0];

        return [30,0,0];
    }

    function speedToInterval(speed) {
        let level = Math.round(Number(speed));
        if(isNaN(level)) level = 5;
        if(level < 1) level = 1;
        if(level > 10) level = 10;

        // speed 越大，動畫越快。
        return 330 - level * 25;
    }

    function clearLocalBuffer() {
        for(let i = 0; i < LED_COUNT; i++) {
            STATE.ledBuffer[i] = [0,0,0];
        }
    }

    function setLocalBufferAll(r, g, b) {
        const rr = limitLEDValue(r);
        const gg = limitLEDValue(g);
        const bb = limitLEDValue(b);

        for(let i = 0; i < LED_COUNT; i++) {
            STATE.ledBuffer[i] = [rr,gg,bb];
        }
    }

    function setLocalBufferBar(value, max, r, g, b) {
        value = Math.round(Number(value));
        max = Math.round(Number(max));

        if(isNaN(value)) value = 0;
        if(isNaN(max) || max <= 0) max = LED_COUNT;
        if(value < 0) value = 0;
        if(value > max) value = max;

        const count = Math.round((value / max) * LED_COUNT);
        clearLocalBuffer();

        for(let i = 1; i <= count; i++) {
            setLocalBufferPixel(i, r, g, b);
        }
    }

    function setLocalBufferPixel(index, r, g, b) {
        const i = limitLEDIndex(index) - 1;
        STATE.ledBuffer[i] = [
            limitLEDValue(r),
            limitLEDValue(g),
            limitLEDValue(b)
        ];
    }

    function setLocalBufferFromArray(arr) {
        for(let i = 0; i < LED_COUNT; i++) {
            if(arr[i]) {
                STATE.ledBuffer[i] = [
                    limitLEDValue(arr[i][0]),
                    limitLEDValue(arr[i][1]),
                    limitLEDValue(arr[i][2])
                ];
            } else {
                STATE.ledBuffer[i] = [0,0,0];
            }
        }
    }

    function rotateHue(step) {
        const phase = step % 6;
        if(phase === 0) return [30,0,0];
        if(phase === 1) return [30,15,0];
        if(phase === 2) return [0,30,0];
        if(phase === 3) return [0,20,30];
        if(phase === 4) return [0,0,30];
        return [25,0,30];
    }

    function sectionLabel(text) {
        if(Scratch.BlockType.LABEL) {
            return { blockType:Scratch.BlockType.LABEL, text:text };
        }
        return "---";
    }

    class OSEPBridge {

        constructor() {
            this.port = null;
            this.reader = null;
            this.buffer = "";
            this.writeQueue = Promise.resolve();
        }

        async connect() {
            try {
                this.port = await navigator.serial.requestPort();

                await this.port.open({
                    baudRate:115200
                });

                STATE.connected = true;
                this.readLoop();

            } catch(e) {
                console.log("Serial connect error:", e);
                STATE.connected = false;
            }
        }

        async readLoop() {
            this.reader = this.port.readable.getReader();

            try {
                while(true) {
                    const { value, done } = await this.reader.read();
                    if(done) break;

                    this.buffer += new TextDecoder().decode(value);

                    let lines = this.buffer.split("\n");
                    this.buffer = lines.pop();

                    for(let line of lines) {
                        try {
                            const data = JSON.parse(line);

                            if(data.btn) {
                                for(let i = 0; i < data.btn.length; i++) {
                                    const oldValue = Number(STATE.btn[i]);
                                    const newValue = Number(data.btn[i]);

                                    if(oldValue === 0 && newValue === 1) {
                                        STATE.down[i] = 1;
                                    }

                                    if(oldValue === 1 && newValue === 0) {
                                        STATE.release[i] = 1;
                                        STATE.click[i] = 1;
                                    }

                                    STATE.prevBtn[i] = oldValue;
                                    STATE.btn[i] = newValue;
                                }
                            }

                            if(data.func !== undefined) STATE.func = Number(data.func);
                            if(data.mode !== undefined) STATE.mode = Number(data.mode);

                        } catch(e) {}
                    }
                }

            } catch(e) {
                console.log("Disconnected:", e);
            }

            STATE.connected = false;
        }

        async sendObjectNow(obj) {
            if(!STATE.connected || !this.port || !this.port.writable) {
                console.log("Cannot send, ESP not connected.");
                return;
            }

            let writer = null;

            try {
                writer = this.port.writable.getWriter();
                const msg = JSON.stringify(obj) + "\n";

                await writer.write(
                    new TextEncoder().encode(msg)
                );

                // C12：每次 WebSerial 控制指令後自動保留 5ms。
                await sleep(COMMUNICATION_DELAY_MS);

            } catch(e) {
                console.log("Send error:", e);
            } finally {
                try {
                    if(writer) writer.releaseLock();
                } catch(e) {}
            }
        }

        async sendObject(obj) {
            // C12：建立簡單送信佇列，避免多個 LED 指令同時搶 writer。
            this.writeQueue = this.writeQueue.then(() => this.sendObjectNow(obj));
            return this.writeQueue;
        }

        sendCommand(cmd) {
            return this.sendObject({cmd:cmd});
        }

        sendRGB(r, g, b) {
            return this.sendObject({
                cmd:"RGB",
                r:limitLEDValue(r),
                g:limitLEDValue(g),
                b:limitLEDValue(b)
            });
        }

        sendPixel(index, r, g, b) {
            return this.sendObject({
                cmd:"PIXEL",
                index:limitLEDIndex(index),
                r:limitLEDValue(r),
                g:limitLEDValue(g),
                b:limitLEDValue(b)
            });
        }

        clearLEDs() {
            return this.sendObject({cmd:"CLEAR"});
        }

        sendBar(value, max) {
            value = Math.round(Number(value));
            max = Math.round(Number(max));

            if(isNaN(value)) value = 0;
            if(isNaN(max) || max <= 0) max = 12;
            if(value < 0) value = 0;
            if(value > max) value = max;

            return this.sendObject({
                cmd:"BAR",
                value:value,
                max:max
            });
        }

        sendBuffer() {
            return this.sendObject({
                cmd:"BUFFER",
                led:STATE.ledBuffer
            });
        }
    }

    const bridge = new OSEPBridge();

    class OSEP_V22C17 {

        getInfo() {
            return {
                id: 'osepv22c17',
                name: 'OSEP V2.2-C17',

                blocks: [

                    sectionLabel('共同積木區：連線、輸入、角色控制與循環計數'),

                    { opcode:'connect', blockType:Scratch.BlockType.COMMAND, text:'連接 ESP8266' },

                    { opcode:'connected', blockType:Scratch.BlockType.BOOLEAN, text:'ESP8266 已連線？' },

                    {
                        opcode:'btn',
                        blockType:Scratch.BlockType.BOOLEAN,
                        text:'按鍵 [ID] 是否按住？',
                        arguments:{ ID:{ type:Scratch.ArgumentType.NUMBER, defaultValue:1 } }
                    },

                    {
                        opcode:'down',
                        blockType:Scratch.BlockType.BOOLEAN,
                        text:'按鍵 [ID] 剛被按下？',
                        arguments:{ ID:{ type:Scratch.ArgumentType.NUMBER, defaultValue:1 } }
                    },

                    {
                        opcode:'released',
                        blockType:Scratch.BlockType.BOOLEAN,
                        text:'按鍵 [ID] 剛被放開？',
                        arguments:{ ID:{ type:Scratch.ArgumentType.NUMBER, defaultValue:1 } }
                    },

                    {
                        opcode:'clicked',
                        blockType:Scratch.BlockType.BOOLEAN,
                        text:'按鍵 [ID] 完成點擊？',
                        arguments:{ ID:{ type:Scratch.ArgumentType.NUMBER, defaultValue:1 } }
                    },

                    { opcode:'func', blockType:Scratch.BlockType.BOOLEAN, text:'功能鍵是否按住？' },

                    { opcode:'anyButtonPressed', blockType:Scratch.BlockType.BOOLEAN, text:'任一按鍵是否按住？' },

                    {
                        opcode:'controllerX',
                        blockType:Scratch.BlockType.REPORTER,
                        text:'控制器 X 軸'
                    },

                    {
                        opcode:'controllerY',
                        blockType:Scratch.BlockType.REPORTER,
                        text:'控制器 Y 軸'
                    },

                    {
                        opcode:'moveSprite',
                        blockType:Scratch.BlockType.COMMAND,
                        text:'用控制器移動角色 速度 [SPEED]',
                        arguments:{
                            SPEED:{ type:Scratch.ArgumentType.NUMBER, defaultValue:5 }
                        }
                    },

                    {
                        opcode:'countLoop',
                        blockType:Scratch.BlockType.CONDITIONAL,
                        branchCount:1,
                        text:'循環計數 [VAR] 從 [START] 到 [END] 間隔 [STEP]',
                        arguments:{
                            VAR:{ type:Scratch.ArgumentType.STRING, defaultValue:'i' },
                            START:{ type:Scratch.ArgumentType.NUMBER, defaultValue:1 },
                            END:{ type:Scratch.ArgumentType.NUMBER, defaultValue:12 },
                            STEP:{ type:Scratch.ArgumentType.NUMBER, defaultValue:1 }
                        }
                    },

                    {
                        opcode:'counter',
                        blockType:Scratch.BlockType.REPORTER,
                        text:'計數值 [VAR]',
                        arguments:{
                            VAR:{ type:Scratch.ArgumentType.STRING, defaultValue:'i' }
                        }
                    },

                    '---',
                    sectionLabel('基礎積木區：LED 直接控制與常用動畫'),

                    {
                        opcode:'setLED',
                        blockType:Scratch.BlockType.COMMAND,
                        text:'設定全部 LED 顏色 [COLOR]',
                        arguments:{
                            COLOR:{
                                type:Scratch.ArgumentType.STRING,
                                menu:'colors',
                                defaultValue:'RED'
                            }
                        }
                    },

                    {
                        opcode:'setLEDRGB',
                        blockType:Scratch.BlockType.COMMAND,
                        text:'設定全部 LED RGB R [R] G [G] B [B]',
                        arguments:{
                            R:{ type:Scratch.ArgumentType.NUMBER, defaultValue:30 },
                            G:{ type:Scratch.ArgumentType.NUMBER, defaultValue:0 },
                            B:{ type:Scratch.ArgumentType.NUMBER, defaultValue:0 }
                        }
                    },

                    {
                        opcode:'setPixelRGB',
                        blockType:Scratch.BlockType.COMMAND,
                        text:'設定第 [INDEX] 顆 LED RGB R [R] G [G] B [B]',
                        arguments:{
                            INDEX:{ type:Scratch.ArgumentType.NUMBER, defaultValue:1 },
                            R:{ type:Scratch.ArgumentType.NUMBER, defaultValue:30 },
                            G:{ type:Scratch.ArgumentType.NUMBER, defaultValue:0 },
                            B:{ type:Scratch.ArgumentType.NUMBER, defaultValue:0 }
                        }
                    },

                    { opcode:'clearLEDs', blockType:Scratch.BlockType.COMMAND, text:'關閉全部 LED' },

                    {
                        opcode:'showBar',
                        blockType:Scratch.BlockType.COMMAND,
                        text:'顯示進度條 LED 數值 [VALUE] 最大 [MAX]',
                        arguments:{
                            VALUE:{ type:Scratch.ArgumentType.NUMBER, defaultValue:6 },
                            MAX:{ type:Scratch.ArgumentType.NUMBER, defaultValue:12 }
                        }
                    },

                    {
                        opcode:'setScoreLED',
                        blockType:Scratch.BlockType.COMMAND,
                        text:'顯示分數 LED 數值 [VALUE] 最大 [MAX]',
                        arguments:{
                            VALUE:{ type:Scratch.ArgumentType.NUMBER, defaultValue:6 },
                            MAX:{ type:Scratch.ArgumentType.NUMBER, defaultValue:12 }
                        }
                    },

                    {
                        opcode:'setLifeLED',
                        blockType:Scratch.BlockType.COMMAND,
                        text:'顯示生命 LED 數值 [VALUE] 最大 [MAX]',
                        arguments:{
                            VALUE:{ type:Scratch.ArgumentType.NUMBER, defaultValue:3 },
                            MAX:{ type:Scratch.ArgumentType.NUMBER, defaultValue:5 }
                        }
                    },

                    {
                        opcode:'setBufferRange',
                        blockType:Scratch.BlockType.COMMAND,
                        text:'設定第 [START] 到 [END] 顆 LED RGB R [R] G [G] B [B]',
                        arguments:{
                            START:{ type:Scratch.ArgumentType.NUMBER, defaultValue:1 },
                            END:{ type:Scratch.ArgumentType.NUMBER, defaultValue:6 },
                            R:{ type:Scratch.ArgumentType.NUMBER, defaultValue:30 },
                            G:{ type:Scratch.ArgumentType.NUMBER, defaultValue:0 },
                            B:{ type:Scratch.ArgumentType.NUMBER, defaultValue:0 }
                        }
                    },

                    {
                        opcode:'setOddBuffer',
                        blockType:Scratch.BlockType.COMMAND,
                        text:'設定奇數 LED RGB R [R] G [G] B [B]',
                        arguments:{
                            R:{ type:Scratch.ArgumentType.NUMBER, defaultValue:30 },
                            G:{ type:Scratch.ArgumentType.NUMBER, defaultValue:0 },
                            B:{ type:Scratch.ArgumentType.NUMBER, defaultValue:0 }
                        }
                    },

                    {
                        opcode:'setEvenBuffer',
                        blockType:Scratch.BlockType.COMMAND,
                        text:'設定偶數 LED RGB R [R] G [G] B [B]',
                        arguments:{
                            R:{ type:Scratch.ArgumentType.NUMBER, defaultValue:0 },
                            G:{ type:Scratch.ArgumentType.NUMBER, defaultValue:0 },
                            B:{ type:Scratch.ArgumentType.NUMBER, defaultValue:30 }
                        }
                    },

                    {
                        opcode:'flashLEDs',
                        blockType:Scratch.BlockType.COMMAND,
                        text:'閃爍全部 LED RGB R [R] G [G] B [B] 次數 [TIMES]',
                        arguments:{
                            R:{ type:Scratch.ArgumentType.NUMBER, defaultValue:30 },
                            G:{ type:Scratch.ArgumentType.NUMBER, defaultValue:0 },
                            B:{ type:Scratch.ArgumentType.NUMBER, defaultValue:0 },
                            TIMES:{ type:Scratch.ArgumentType.NUMBER, defaultValue:3 }
                        }
                    },

                    {
                        opcode:'playLEDAnimation',
                        blockType:Scratch.BlockType.COMMAND,
                        text:'播放 LED 動畫 [EFFECT] 顏色 [COLOR] 速度 [SPEED]',
                        arguments:{
                            EFFECT:{ type:Scratch.ArgumentType.STRING, menu:'effects', defaultValue:'RUNNING' },
                            COLOR:{ type:Scratch.ArgumentType.STRING, menu:'animationColors', defaultValue:'RED' },
                            SPEED:{ type:Scratch.ArgumentType.NUMBER, defaultValue:5 }
                        }
                    },

                    { opcode:'stopLEDAnimation', blockType:Scratch.BlockType.COMMAND, text:'停止 LED 動畫' },

                    {
                        opcode:'demoLEDEffect',
                        blockType:Scratch.BlockType.COMMAND,
                        text:'展示 LED 效果 [DEMO]',
                        arguments:{
                            DEMO:{ type:Scratch.ArgumentType.STRING, menu:'demos', defaultValue:'GAME_START' }
                        }
                    },

                    '---',
                    sectionLabel('進階積木區：LED 暫存陣列編輯與資料操作'),

                    { opcode:'clearBuffer', blockType:Scratch.BlockType.COMMAND, text:'清空 LED 暫存陣列' },

                    { opcode:'clearAndShowBuffer', blockType:Scratch.BlockType.COMMAND, text:'清空並顯示 LED 暫存陣列' },

                    {
                        opcode:'setBufferPixel',
                        blockType:Scratch.BlockType.COMMAND,
                        text:'設定暫存陣列第 [INDEX] 顆 LED RGB R [R] G [G] B [B]',
                        arguments:{
                            INDEX:{ type:Scratch.ArgumentType.NUMBER, defaultValue:1 },
                            R:{ type:Scratch.ArgumentType.NUMBER, defaultValue:30 },
                            G:{ type:Scratch.ArgumentType.NUMBER, defaultValue:0 },
                            B:{ type:Scratch.ArgumentType.NUMBER, defaultValue:0 }
                        }
                    },

                    { opcode:'showBuffer', blockType:Scratch.BlockType.COMMAND, text:'顯示 LED 暫存陣列' },

                    { opcode:'shiftBufferLeft', blockType:Scratch.BlockType.COMMAND, text:'LED 暫存陣列向左平移' },

                    { opcode:'shiftBufferRight', blockType:Scratch.BlockType.COMMAND, text:'LED 暫存陣列向右平移' },

                    { opcode:'rotateBufferLeft', blockType:Scratch.BlockType.COMMAND, text:'LED 暫存陣列向左旋轉' },

                    { opcode:'rotateBufferRight', blockType:Scratch.BlockType.COMMAND, text:'LED 暫存陣列向右旋轉' },

                    {
                        opcode:'fillBuffer',
                        blockType:Scratch.BlockType.COMMAND,
                        text:'填滿 LED 暫存陣列 RGB R [R] G [G] B [B]',
                        arguments:{
                            R:{ type:Scratch.ArgumentType.NUMBER, defaultValue:0 },
                            G:{ type:Scratch.ArgumentType.NUMBER, defaultValue:0 },
                            B:{ type:Scratch.ArgumentType.NUMBER, defaultValue:5 }
                        }
                    },

                    {
                        opcode:'copyBufferPixel',
                        blockType:Scratch.BlockType.COMMAND,
                        text:'複製暫存陣列第 [FROM] 顆到第 [TO] 顆',
                        arguments:{
                            FROM:{ type:Scratch.ArgumentType.NUMBER, defaultValue:1 },
                            TO:{ type:Scratch.ArgumentType.NUMBER, defaultValue:2 }
                        }
                    },

                    {
                        opcode:'getBufferR',
                        blockType:Scratch.BlockType.REPORTER,
                        text:'暫存陣列第 [INDEX] 顆 R 值',
                        arguments:{ INDEX:{ type:Scratch.ArgumentType.NUMBER, defaultValue:1 } }
                    },

                    {
                        opcode:'getBufferG',
                        blockType:Scratch.BlockType.REPORTER,
                        text:'暫存陣列第 [INDEX] 顆 G 值',
                        arguments:{ INDEX:{ type:Scratch.ArgumentType.NUMBER, defaultValue:1 } }
                    },

                    {
                        opcode:'getBufferB',
                        blockType:Scratch.BlockType.REPORTER,
                        text:'暫存陣列第 [INDEX] 顆 B 值',
                        arguments:{ INDEX:{ type:Scratch.ArgumentType.NUMBER, defaultValue:1 } }
                    },

                    {
                        opcode:'isBufferPixelOn',
                        blockType:Scratch.BlockType.BOOLEAN,
                        text:'暫存陣列第 [INDEX] 顆是否亮著？',
                        arguments:{ INDEX:{ type:Scratch.ArgumentType.NUMBER, defaultValue:1 } }
                    },

                    { opcode:'reverseBuffer', blockType:Scratch.BlockType.COMMAND, text:'反轉 LED 暫存陣列' }
                ],

                menus:{
                    colors:{
                        acceptReporters:true,
                        items:['RED','GREEN','BLUE','WHITE','OFF']
                    },
                    animationColors:{
                        acceptReporters:true,
                        items:['RED','GREEN','BLUE','WHITE','YELLOW','PURPLE','CYAN','ORANGE','PINK']
                    },
                    effects:{
                        acceptReporters:true,
                        items:['RUNNING','BREATH','BLINK','SPIN','COUNTDOWN','RAINBOW','POLICE','HEARTBEAT']
                    },
                    demos:{
                        acceptReporters:true,
                        items:['GAME_START','SCORE_UP','LIFE_LOSE','SUCCESS','WARNING','GAME_OVER']
                    }
                }
            };
        }

        connect() {
            return bridge.connect();
        }

        getIndex(args) {
            return Number(args.ID) - 1;
        }

        btn(args) {
            const index = this.getIndex(args);
            if(index < 0 || index >= STATE.btn.length) return false;
            return STATE.btn[index] === 1;
        }

        down(args) {
            const index = this.getIndex(args);
            if(index < 0 || index >= STATE.down.length) return false;

            if(STATE.down[index] === 1) {
                STATE.down[index] = 0;
                return true;
            }

            return false;
        }

        released(args) {
            const index = this.getIndex(args);
            if(index < 0 || index >= STATE.release.length) return false;

            if(STATE.release[index] === 1) {
                STATE.release[index] = 0;
                return true;
            }

            return false;
        }

        clicked(args) {
            const index = this.getIndex(args);
            if(index < 0 || index >= STATE.click.length) return false;

            if(STATE.click[index] === 1) {
                STATE.click[index] = 0;
                return true;
            }

            return false;
        }

        func() {
            return STATE.func === 1;
        }

        anyButtonPressed() {
            for(let i = 0; i < STATE.btn.length; i++) {
                if(STATE.btn[i] === 1) return true;
            }
            return STATE.func === 1;
        }

        connected() {
            return STATE.connected;
        }

        // =================================================
        // 會直接送 WebSerial 指令的積木：C12 內建 5ms 通訊延遲
        // =================================================
        setLED(args) {
            // C14：基礎區直接控制積木會同步修改 ledBuffer，
            // 再用 BUFFER 顯示，讓「實際燈光」與「Buffer 狀態」一致。
            this.stopLEDAnimationOnly();
            const rgb = colorToRGB(args.COLOR);
            setLocalBufferAll(rgb[0], rgb[1], rgb[2]);
            return bridge.sendBuffer();
        }

        setLEDRGB(args) {
            // C14：全燈 RGB 直接控制，同步更新整個 ledBuffer。
            this.stopLEDAnimationOnly();
            setLocalBufferAll(args.R, args.G, args.B);
            return bridge.sendBuffer();
        }

        setPixelRGB(args) {
            // C14：單顆 LED 直接控制，同步更新 ledBuffer 中對應的一顆。
            this.stopLEDAnimationOnly();
            setLocalBufferPixel(args.INDEX, args.R, args.G, args.B);
            return bridge.sendBuffer();
        }

        clearLEDs() {
            // C14：清燈時同步清空 ledBuffer。
            this.stopLEDAnimationOnly();
            clearLocalBuffer();
            return bridge.sendBuffer();
        }

        showBar(args) {
            // C14：LED bar 改由 Extension 端建立 Buffer 後直接顯示，
            // 顏色維持 C7 BAR 的黃 / 黃綠色。
            this.stopLEDAnimationOnly();
            setLocalBufferBar(args.VALUE, args.MAX, 30, 30, 0);
            return bridge.sendBuffer();
        }

        clearBuffer() {
            clearLocalBuffer();
        }

        clearAndShowBuffer() {
            this.stopLEDAnimationOnly();
            clearLocalBuffer();
            return bridge.sendBuffer();
        }

        setBufferPixel(args) {
            setLocalBufferPixel(args.INDEX, args.R, args.G, args.B);
        }

        showBuffer() {
            this.stopLEDAnimationOnly();
            return bridge.sendBuffer();
        }

        shiftBufferLeft() {
            // C13：真正的平移。左邊移出後消失，右邊補黑。
            for(let i = 0; i < LED_COUNT - 1; i++) {
                STATE.ledBuffer[i] = copyColor(STATE.ledBuffer[i + 1]);
            }

            STATE.ledBuffer[LED_COUNT - 1] = [0,0,0];
        }

        shiftBufferRight() {
            // C13：真正的平移。右邊移出後消失，左邊補黑。
            for(let i = LED_COUNT - 1; i > 0; i--) {
                STATE.ledBuffer[i] = copyColor(STATE.ledBuffer[i - 1]);
            }

            STATE.ledBuffer[0] = [0,0,0];
        }

        rotateBufferLeft() {
            // C13：循環旋轉。第一顆會移到最後一顆。
            const first = copyColor(STATE.ledBuffer[0]);

            for(let i = 0; i < LED_COUNT - 1; i++) {
                STATE.ledBuffer[i] = copyColor(STATE.ledBuffer[i + 1]);
            }

            STATE.ledBuffer[LED_COUNT - 1] = first;
        }

        rotateBufferRight() {
            // C13：循環旋轉。最後一顆會移到第一顆。
            const last = copyColor(STATE.ledBuffer[LED_COUNT - 1]);

            for(let i = LED_COUNT - 1; i > 0; i--) {
                STATE.ledBuffer[i] = copyColor(STATE.ledBuffer[i - 1]);
            }

            STATE.ledBuffer[0] = last;
        }

        fillBuffer(args) {
            setLocalBufferAll(args.R, args.G, args.B);
        }

        copyBufferPixel(args) {
            const fromIndex = limitLEDIndex(args.FROM) - 1;
            const toIndex = limitLEDIndex(args.TO) - 1;

            STATE.ledBuffer[toIndex] =
                copyColor(STATE.ledBuffer[fromIndex]);
        }

        getBufferR(args) {
            const index = limitLEDIndex(args.INDEX) - 1;
            return STATE.ledBuffer[index][0];
        }

        getBufferG(args) {
            const index = limitLEDIndex(args.INDEX) - 1;
            return STATE.ledBuffer[index][1];
        }

        getBufferB(args) {
            const index = limitLEDIndex(args.INDEX) - 1;
            return STATE.ledBuffer[index][2];
        }

        isBufferPixelOn(args) {
            const index = limitLEDIndex(args.INDEX) - 1;
            const rgb = STATE.ledBuffer[index];
            return (Number(rgb[0]) || 0) > 0 || (Number(rgb[1]) || 0) > 0 || (Number(rgb[2]) || 0) > 0;
        }

        setBufferRange(args) {
            // C13：這個積木改成「直接燈光控制」。
            // 設定指定區段後會立即顯示，不需要學生再接 show LED buffer。
            this.stopLEDAnimationOnly();

            let start = limitLEDIndex(args.START);
            let end = limitLEDIndex(args.END);

            const r = limitLEDValue(args.R);
            const g = limitLEDValue(args.G);
            const b = limitLEDValue(args.B);

            if(start > end) {
                const temp = start;
                start = end;
                end = temp;
            }

            clearLocalBuffer();

            for(let i = start; i <= end; i++) {
                STATE.ledBuffer[i - 1] = [r,g,b];
            }

            return bridge.sendBuffer();
        }

        setOddBuffer(args) {
            // C13：這個積木改成「直接燈光控制」。
            // 設定奇數 LED 後會立即顯示，不需要學生再接 show LED buffer。
            this.stopLEDAnimationOnly();

            const r = limitLEDValue(args.R);
            const g = limitLEDValue(args.G);
            const b = limitLEDValue(args.B);

            clearLocalBuffer();

            for(let i = 1; i <= LED_COUNT; i += 2) {
                STATE.ledBuffer[i - 1] = [r,g,b];
            }

            return bridge.sendBuffer();
        }

        setEvenBuffer(args) {
            // C13：這個積木改成「直接燈光控制」。
            // 設定偶數 LED 後會立即顯示，不需要學生再接 show LED buffer。
            this.stopLEDAnimationOnly();

            const r = limitLEDValue(args.R);
            const g = limitLEDValue(args.G);
            const b = limitLEDValue(args.B);

            clearLocalBuffer();

            for(let i = 2; i <= LED_COUNT; i += 2) {
                STATE.ledBuffer[i - 1] = [r,g,b];
            }

            return bridge.sendBuffer();
        }

        reverseBuffer() {
            STATE.ledBuffer.reverse();
        }

        mirrorLeftToRight() {
            for(let i = 0; i < LED_COUNT / 2; i++) {
                STATE.ledBuffer[LED_COUNT - 1 - i] =
                    copyColor(STATE.ledBuffer[i]);
            }
        }

        setScoreLED(args) {
            this.stopLEDAnimationOnly();

            const value = Math.round(Number(args.VALUE));
            const max = Math.round(Number(args.MAX));

            const safeMax = (!isNaN(max) && max > 0) ? max : 12;
            const safeValue = Math.max(0, Math.min(safeMax, isNaN(value) ? 0 : value));

            const count = Math.round((safeValue / safeMax) * LED_COUNT);

            clearLocalBuffer();

            for(let i = 1; i <= count; i++) {
                STATE.ledBuffer[i - 1] = [0,30,0];
            }

            return bridge.sendBuffer();
        }

        setLifeLED(args) {
            this.stopLEDAnimationOnly();

            const value = Math.round(Number(args.VALUE));
            const max = Math.round(Number(args.MAX));

            const safeMax = (!isNaN(max) && max > 0) ? max : 5;
            const safeValue = Math.max(0, Math.min(safeMax, isNaN(value) ? 0 : value));

            const count = Math.round((safeValue / safeMax) * LED_COUNT);

            clearLocalBuffer();

            for(let i = 1; i <= count; i++) {
                STATE.ledBuffer[i - 1] = [30,0,0];
            }

            return bridge.sendBuffer();
        }

        flashLEDs(args) {
            this.stopLEDAnimationOnly();

            const r = limitLEDValue(args.R);
            const g = limitLEDValue(args.G);
            const b = limitLEDValue(args.B);

            let times = Math.round(Number(args.TIMES));
            if(isNaN(times) || times < 1) times = 1;
            if(times > 10) times = 10;

            let count = 0;

            STATE.animationName = "FLASH";
            STATE.animationTimer = setInterval(() => {
                if(count >= times * 2) {
                    this.stopLEDAnimationOnly();
                    clearLocalBuffer();
                    bridge.sendBuffer();
                    return;
                }

                if(count % 2 === 0) {
                    setLocalBufferAll(r,g,b);
                    bridge.sendBuffer();
                } else {
                    clearLocalBuffer();
                    bridge.sendBuffer();
                }

                count++;
            }, 120);
        }

        // =================================================
        // C12：常用動畫展示積木
        // =================================================
        stopLEDAnimationOnly() {
            if(STATE.animationTimer) {
                clearInterval(STATE.animationTimer);
                STATE.animationTimer = null;
            }
            STATE.animationName = "NONE";
        }

        stopLEDAnimation() {
            this.stopLEDAnimationOnly();
            clearLocalBuffer();
            return bridge.sendBuffer();
        }

        playLEDAnimation(args) {
            this.stopLEDAnimationOnly();

            const effect = String(args.EFFECT || "RUNNING").toUpperCase();
            const rgb = colorToRGB(args.COLOR);
            const interval = speedToInterval(args.SPEED);
            let step = 0;

            STATE.animationName = effect;

            STATE.animationTimer = setInterval(() => {
                clearLocalBuffer();

                if(effect === "RUNNING") {
                    setLocalBufferPixel((step % LED_COUNT) + 1, rgb[0], rgb[1], rgb[2]);
                    bridge.sendBuffer();
                }
                else if(effect === "BLINK") {
                    if(step % 2 === 0) setLocalBufferAll(rgb[0], rgb[1], rgb[2]);
                    else clearLocalBuffer();
                    bridge.sendBuffer();
                }
                else if(effect === "SPIN") {
                    for(let i = 0; i < 3; i++) {
                        const index = ((step + i * 2) % LED_COUNT) + 1;
                        const level = Math.max(8, 30 - i * 8);
                        setLocalBufferPixel(index, Math.min(rgb[0], level), Math.min(rgb[1], level), Math.min(rgb[2], level));
                    }
                    bridge.sendBuffer();
                }
                else if(effect === "COUNTDOWN") {
                    const remain = LED_COUNT - (step % (LED_COUNT + 1));
                    for(let i = 1; i <= remain; i++) {
                        setLocalBufferPixel(i, rgb[0], rgb[1], rgb[2]);
                    }
                    bridge.sendBuffer();
                }
                else if(effect === "RAINBOW") {
                    for(let i = 0; i < LED_COUNT; i++) {
                        const c = rotateHue(i + step);
                        STATE.ledBuffer[i] = c;
                    }
                    bridge.sendBuffer();
                }
                else if(effect === "POLICE") {
                    for(let i = 0; i < LED_COUNT; i++) {
                        if((i + step) % 2 === 0) STATE.ledBuffer[i] = [30,0,0];
                        else STATE.ledBuffer[i] = [0,0,30];
                    }
                    bridge.sendBuffer();
                }
                else if(effect === "HEARTBEAT") {
                    const p = step % 6;
                    if(p === 0 || p === 2) setLocalBufferAll(rgb[0], rgb[1], rgb[2]);
                    else clearLocalBuffer();
                    bridge.sendBuffer();
                }
                else if(effect === "BREATH") {
                    const wave = step % 20;
                    const level = wave < 10 ? wave * 3 : (20 - wave) * 3;
                    const r = Math.round(rgb[0] * level / 30);
                    const g = Math.round(rgb[1] * level / 30);
                    const b = Math.round(rgb[2] * level / 30);
                    setLocalBufferAll(r,g,b);
                    bridge.sendBuffer();
                }

                step++;
            }, interval);
        }

        demoLEDEffect(args) {
            const demo = String(args.DEMO || "GAME_START").toUpperCase();

            this.stopLEDAnimationOnly();

            if(demo === "GAME_START") {
                this.playLEDAnimation({EFFECT:"RAINBOW", COLOR:"WHITE", SPEED:8});
                setTimeout(() => this.stopLEDAnimation(), 1800);
            }
            else if(demo === "SCORE_UP") {
                this.playLEDAnimation({EFFECT:"SPIN", COLOR:"GREEN", SPEED:8});
                setTimeout(() => this.stopLEDAnimation(), 900);
            }
            else if(demo === "LIFE_LOSE") {
                this.flashLEDs({R:30,G:0,B:0,TIMES:3});
            }
            else if(demo === "SUCCESS") {
                this.playLEDAnimation({EFFECT:"BREATH", COLOR:"GREEN", SPEED:7});
                setTimeout(() => this.stopLEDAnimation(), 1500);
            }
            else if(demo === "WARNING") {
                this.playLEDAnimation({EFFECT:"BLINK", COLOR:"YELLOW", SPEED:9});
                setTimeout(() => this.stopLEDAnimation(), 1200);
            }
            else if(demo === "GAME_OVER") {
                this.playLEDAnimation({EFFECT:"COUNTDOWN", COLOR:"RED", SPEED:6});
                setTimeout(() => this.stopLEDAnimation(), 2200);
            }
        }

        // =================================================
        // C14：控制器 X / Y 與角色控制
        // -------------------------------------------------
        // 依照目前實測硬體配置：
        // BTN1 = Y 軸往上，BTN2 = Y 軸往下
        // BTN3 = X 軸往左，BTN4 = X 軸往右
        // Function key 保留為獨立功能鍵，不混入方向控制。
        // =================================================
        controllerX() {
            const left = STATE.btn[2] === 1 ? 1 : 0;
            const right = STATE.btn[3] === 1 ? 1 : 0;

            return right - left;
        }

        controllerY() {
            const up = STATE.btn[0] === 1 ? 1 : 0;
            const down = STATE.btn[1] === 1 ? 1 : 0;

            return up - down;
        }

        moveSprite(args, util) {
            const speed = Number(args.SPEED) || 0;

            const dx = this.controllerX() * speed;
            const dy = this.controllerY() * speed;

            try {
                util.target.setXY(
                    util.target.x + dx,
                    util.target.y + dy
                );
            } catch(e) {}
        }

        countLoop(args, util) {
            const name = String(args.VAR || 'i');

            let start = Number(args.START);
            let end = Number(args.END);
            let step = Number(args.STEP);

            if(isNaN(start)) start = 1;
            if(isNaN(end)) end = 12;
            if(isNaN(step) || step === 0) step = 1;

            if(!util.stackFrame.initialized) {
                util.stackFrame.initialized = true;
                util.stackFrame.current = start;
                util.stackFrame.end = end;
                util.stackFrame.step = step;
            }

            const current = util.stackFrame.current;
            const finalEnd = util.stackFrame.end;
            const finalStep = util.stackFrame.step;

            const keepGoing =
                finalStep > 0
                ? current <= finalEnd
                : current >= finalEnd;

            if(keepGoing) {
                STATE.loopVars[name] = current;
                setScratchVariable(util, name, current);
                util.stackFrame.current += finalStep;
                util.startBranch(1, true);
            }
        }

        counter(args) {
            const name = String(args.VAR || 'i');

            if(STATE.loopVars[name] === undefined) {
                return 0;
            }

            return STATE.loopVars[name];
        }
    }

    Scratch.extensions.register(new OSEP_V22C17());

})(Scratch);
