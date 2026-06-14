#include <Adafruit_NeoPixel.h>

// ===========================
// 按鈕腳位
// ===========================

#define BTN_1    D1    // F鍵 (LOW)
#define BTN_2    D2    // B鍵 (LOW)
#define BTN_3    D3    // L鍵 (LOW)
#define BTN_4    D4    // R鍵 (LOW)

#define BTN_0    D0    // U鍵 (HIGH)

#define BTN_5    D5    // D鍵 (LOW)
#define BTN_6    D6    // O鍵 (LOW)
#define BTN_7    D7    // C鍵 (LOW)

// ===========================
// WS2812
// ===========================

#define LED_PIN    D8
#define LED_COUNT  12

Adafruit_NeoPixel ring(
  LED_COUNT,
  LED_PIN,
  NEO_GRB + NEO_KHZ800
);

// ===========================
// 全域變數
// ===========================

String rxBuffer = "";

unsigned long lastSend = 0;

// ===========================
// 設定所有 LED 顏色
// ===========================

void setAllColor(
  uint8_t r,
  uint8_t g,
  uint8_t b
)
{
  for (int i = 0; i < LED_COUNT; i++)
  {
    ring.setPixelColor(
      i,
      ring.Color(r, g, b)
    );
  }

  ring.show();
}

// ===========================
// 處理接收到的命令
// ===========================

void processCommand(String cmd)
{
  cmd.trim();

  Serial.print("CMD:");
  Serial.println(cmd);

  if (cmd == "RED")
  {
    setAllColor(255, 0, 0);
  }
  else if (cmd == "GREEN")
  {
    setAllColor(0, 255, 0);
  }
  else if (cmd == "BLUE")
  {
    setAllColor(0, 0, 255);
  }
  else if (cmd == "WHITE")
  {
    setAllColor(255, 255, 255);
  }
  else if (cmd == "OFF")
  {
    setAllColor(0, 0, 0);
  }
}

// ===========================
// 傳送按鈕狀態
// 格式：
// BTN:b1,b2,b3,b4,b0,b5,b6,b7
// ===========================

void sendButtons()
{
  int b1 = !digitalRead(BTN_1);
  int b2 = !digitalRead(BTN_2);
  int b3 = !digitalRead(BTN_3);
  int b4 = !digitalRead(BTN_4);

  int b0 = digitalRead(BTN_0);

  int b5 = !digitalRead(BTN_5);
  int b6 = !digitalRead(BTN_6);
  int b7 = !digitalRead(BTN_7);

  Serial.print("BTN:");

  Serial.print(b1);
  Serial.print(",");

  Serial.print(b2);
  Serial.print(",");

  Serial.print(b3);
  Serial.print(",");

  Serial.print(b4);
  Serial.print(",");

  Serial.print(b0);
  Serial.print(",");

  Serial.print(b5);
  Serial.print(",");

  Serial.print(b6);
  Serial.print(",");

  Serial.println(b7);
}

// ===========================
// Setup
// ===========================

void setup()
{
  Serial.begin(115200);

  // LOW觸發按鈕

  pinMode(BTN_1, INPUT_PULLUP);
  pinMode(BTN_2, INPUT_PULLUP);
  pinMode(BTN_3, INPUT_PULLUP);
  pinMode(BTN_4, INPUT_PULLUP);

  pinMode(BTN_5, INPUT_PULLUP);
  pinMode(BTN_6, INPUT_PULLUP);
  pinMode(BTN_7, INPUT_PULLUP);

  // U鍵為 HIGH 觸發

  pinMode(BTN_0, INPUT);

  // WS2812初始化

  ring.begin();
  ring.clear();
  ring.show();

  Serial.println();
  Serial.println("ESP8266 GamePad Ready");
}

// ===========================
// Loop
// ===========================

void loop()
{
  // -----------------------
  // 接收 Serial 指令
  // -----------------------

  while (Serial.available())
  {
    char c = Serial.read();

    if (c == '\n')
    {
      processCommand(rxBuffer);
      rxBuffer = "";
    }
    else if (c != '\r')
    {
      rxBuffer += c;
    }
  }

  // -----------------------
  // 每50ms傳送按鈕狀態
  // -----------------------

  if (millis() - lastSend >= 50)
  {
    lastSend = millis();
    sendButtons();
  }
}