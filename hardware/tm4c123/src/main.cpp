#include <stdio.h>
#include <Energia.h>
#include "HX711.h"

#define calibration_factor 9290.0 //This value is obtained using the SparkFun_HX711_Calibration sketch

#define DOUT_1 PB_1
#define CLK_1 PB_0

#define DOUT_2 PE_4
#define CLK_2 PE_5

#define DOUT_3 PB_4
#define CLK_3 PA_5

#define DOUT_4 PA_6
#define CLK_4 PA_7

#define DOUT_5 PD_0
#define CLK_5 PD_1

#define DOUT_6 PD_2
#define CLK_6 PD_3

#define DOUT_7 PE_1
#define CLK_7 PE_2

#define DOUT_8 PE_3
#define CLK_8 PF_1

// HX711 scale[8];
const byte DOUT[8] = {
    DOUT_1,
    DOUT_2,
    DOUT_3,
    DOUT_4,
    DOUT_5,
    DOUT_6,
    DOUT_7,
    DOUT_8};
const byte CLK[8] = {
    CLK_1,
    CLK_2,
    CLK_3,
    CLK_4,
    CLK_5,
    CLK_6,
    CLK_7,
    CLK_8};

// #define DEBUG_OUTPUT

const int ledR = RED_LED;
const int ledG = GREEN_LED;
const int ledB = BLUE_LED;

String uart_buf;

void decodeUart();
void getCurrentLevel(char slot_id);
void startSlot(char slot_id);
void tareSlot(char slot_id, int times);
void setupSlots();
void uartHandler();
void sendCurrentLevel();
void char_reading(char *chr, int slot_id, int times);

typedef struct Slots
{
  char batch_id[36];
  bool selected;
  double current_level;
  HX711 scale;
  byte DOUT;
  byte CLK;
} Slot;

Slot keg_slots[8];
int selected_sid = 0;

int counter = 0; 

void setup()
{
  // initialize ports
  pinMode(ledR, OUTPUT);
  pinMode(ledG, OUTPUT);
  pinMode(ledB, OUTPUT);
  setupSlots();
  Serial.begin(115200); //connected with USB
  delay(100);
  Serial2.begin(115200); //RS232: Rx = PD6; Tx = PD7
  delay(100);
}

void loop()
{
  uartHandler();
  sendCurrentLevel();
}

void setupSlots()
{
  for (int i = 0; i < 8; i++)
  {
    keg_slots[i].selected = false;
    keg_slots[i].DOUT = DOUT[i];
    keg_slots[i].CLK = CLK[i];
  }
}

void uartHandler()
{
  if (Serial2.available() > 0)
  {
    char recv = Serial2.read();
    uart_buf += recv;
    if (recv == '\n')
    {
      decodeUart();
      uart_buf = "";
    }
  }
}

void decodeUart()
{
#ifdef DEBUG_OUTPUT
  Serial.print(uart_buf);
#endif

  // parse incoming command
  if(uart_buf.substring(0, 6) == "!w nb:")
  {
    // user requesting to start a new batch
    startSlot(uart_buf[6]);
  }
  if(uart_buf.substring(0, 6) == "!w rt:")
  {
    int i = uart_buf.substring(6, 7).toInt();
    tareSlot(i, 10);
  }
}

// void get_current_level(char slot_id)
// {
//   int i = (int)slot_id;
//   int reading = keg_slots[i].scale.get_units();
//   Serial.write("Sending current level: " + reading);
//   Serial2.write("!tg" + reading);
// }

void startSlot(char slot_id)
{
  int i = (int)slot_id;
  i = i - '0';
  i--;
  Serial.write("slot id: ");
  Serial.write(slot_id);
  Serial.write("\n");
  keg_slots[i].scale.begin(DOUT[i], CLK[i]);
  keg_slots[i].scale.set_scale(calibration_factor);
  tareSlot(i, 10);
  Serial.write("Reading: ");
  char chr_rdng[5];
  char_reading(chr_rdng, i, 20);
  Serial.write(chr_rdng);
  Serial.write("\n");
  Serial.write("Success: sending ack back\n");
  Serial2.write("!t nb:");
  Serial2.write(slot_id);
  Serial2.write("\n");
  keg_slots[i].selected = true;
  if (selected_sid != 0)
  {
    keg_slots[selected_sid - 1].selected = false;
  }
}

void char_reading(char *chr, int slot_id, int times)
{
  float reading = keg_slots[slot_id].scale.get_units(times);
  gcvt(reading, 6, chr);
}

void sendCurrentLevel()
{
  if (counter > 100000)
  {
    for (int i = 0; i < 8; i++)
    {
      if (keg_slots[i].selected)
      {
        char r[6];
        char_reading(r, i, 5);
        Serial.write("sending reading: ");
        Serial.write(r);
        Serial.write("\n");
        Serial2.write("!t nr:");
        Serial2.write(r);
        Serial2.write("\n");
      }
    }
    counter = 0;
  }
  counter++;
}

void tareSlot(char slot_id, int times)
{
  keg_slots[slot_id].scale.tare(times);
}
