#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>

#define BTN_1 D1
#define BTN_2 D2
#define BTN_3 D3
#define BTN_4 D4

#define BTN_0 D0   // FUNCTION KEY (PULLDOWN)
#define BTN_5 D5
#define BTN_6 D6
#define BTN_7 D7

#define LED_PIN D8
#define LED_COUNT 12

Adafruit_NeoPixel ring(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

String rxBuffer = "";
unsigned long lastSend = 0;

// ===========================
// LED
// ===========================

void setAll(uint8_t r, uint8_t g, uint8_t b)
{
  for(int i=0;i<LED_COUNT;i++)
    ring.setPixelColor(i, ring.Color(r,g,b));

  ring.show();
}

// ===========================
// 傳送 JSON（V2標準）
// ===========================

void sendState()
{
  StaticJsonDocument<192> doc;

  JsonArray btn = doc.createNestedArray("btn");

  btn.add(!digitalRead(BTN_1) ? 1 : 0);
  btn.add(!digitalRead(BTN_2) ? 1 : 0);
  btn.add(!digitalRead(BTN_3) ? 1 : 0);
  btn.add(!digitalRead(BTN_4) ? 1 : 0);
  btn.add(!digitalRead(BTN_5) ? 1 : 0);
  btn.add(!digitalRead(BTN_6) ? 1 : 0);
  btn.add(!digitalRead(BTN_7) ? 1 : 0);

  doc["func"] = digitalRead(BTN_0) ? 1 : 0;

  // 可選：未來擴充
  doc["mode"] = 0;

  serializeJson(doc, Serial);
  Serial.println();
}

// ===========================
// JSON 指令
// ===========================

void processJSON(String json)
{
  StaticJsonDocument<128> doc;

  if(deserializeJson(doc, json))
    return;

  const char* cmd = doc["cmd"];

  if(!cmd) return;

  if(strcmp(cmd,"RED")==0) setAll(255,0,0);
  else if(strcmp(cmd,"GREEN")==0) setAll(0,255,0);
  else if(strcmp(cmd,"BLUE")==0) setAll(0,0,255);
  else if(strcmp(cmd,"WHITE")==0) setAll(255,255,255);
  else if(strcmp(cmd,"OFF")==0) setAll(0,0,0);
}

// ===========================
// setup
// ===========================

void setup()
{
  Serial.begin(115200);

  // 標準鍵
  pinMode(BTN_1, INPUT_PULLUP);
  pinMode(BTN_2, INPUT_PULLUP);
  pinMode(BTN_3, INPUT_PULLUP);
  pinMode(BTN_4, INPUT_PULLUP);
  pinMode(BTN_5, INPUT_PULLUP);
  pinMode(BTN_6, INPUT_PULLUP);
  pinMode(BTN_7, INPUT_PULLUP);

  // ⭐ FUNCTION KEY
  pinMode(BTN_0, INPUT_PULLDOWN_16);

  ring.begin();
  ring.clear();
  ring.show();

  Serial.println("OSEP V2 Hardware Standard Ready");
}

// ===========================
// loop
// ===========================

void loop()
{
  while(Serial.available())
  {
    char c = Serial.read();

    if(c=='\n')
    {
      processJSON(rxBuffer);
      rxBuffer="";
    }
    else if(c!='\r')
    {
      rxBuffer += c;
    }
  }

  if(millis()-lastSend > 20)
  {
    lastSend = millis();
    sendState();
  }
}