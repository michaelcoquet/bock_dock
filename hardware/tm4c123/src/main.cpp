#include <stdio.h>
#include <Energia.h>
#include <EEPROM.h>
#include "HX711.h"

#define calibration_factor 9290.0 //This value is obtained using the SparkFun_HX711_Calibration sketch

#define DENSITY 65.23722 // lbs/ft^3                                                    \
                         // average density of beer, to get more accurate               \
                         // can get an input from the user for specific gravity         \
                         // and use a formula to obtain density for each specific batch \
                         // but for now just an average density will be used since      \
                         // the variance of most beer is only 20 kg/m^3

#define L_F_3 28.3168 // liters per cubic foot

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
void tareSlot(int slot_id, int times);
void setupSlots();
void uartHandler();
void sendCurrentLevel();
float reading(int slot_id, int times);
float lbsToL(float lbs);
void scheduledUploads();

typedef struct Slots
{
  bool active;
  String batch_id;
  bool selected;
  double current_level;
  HX711 scale;
  byte DOUT;
  byte CLK;
} Slot;

Slot keg_slots[8];
int selected_sid = 0;

bool nb_sending = false;
bool sending = false;

unsigned long start_millis_t1;
unsigned long start_millis_t2;
unsigned long cur_millis_t1;
unsigned long cur_millis_t2;
const unsigned long period = 1500;
const unsigned long upPeriod = 20000;

int active[8] = {0, 0, 0, 0, 0, 0, 0, 0};

void setup()
{
  setupSlots();
  // initialize ports
  pinMode(ledR, OUTPUT);
  pinMode(ledG, OUTPUT);
  pinMode(ledB, OUTPUT);
  Serial.begin(115200); //connected with USB
  delay(100);
  Serial2.begin(115200); //RS232: Rx = PD6; Tx = PD7
  delay(100);

  start_millis_t1 = millis();
  start_millis_t2 = millis();
}

void loop()
{
  sendCurrentLevel();
  scheduledUploads();
  uartHandler();
}

void setupSlots()
{
  for (int i = 0; i < 8; i++)
  {
    keg_slots[i].selected = false;
    keg_slots[i].DOUT = DOUT[i];
    keg_slots[i].CLK = CLK[i];
    keg_slots[i].scale.begin(DOUT[i], CLK[i]);
    keg_slots[i].scale.set_scale(calibration_factor);
    keg_slots[i].active = active[i];
  }
}

// t1
void uartHandler()
{
  if (Serial2.available() > 0)
  {
    char recv = Serial2.read();
    uart_buf += recv;
    if (recv == '\n')
    {
      decodeUart();
    }
  }
}

void decodeUart()
{
#ifdef DEBUG_OUTPUT
  Serial.print(uart_buf);
#endif

  // parse incoming command
  if (uart_buf.substring(0, 6) == "!w nb:")
  {
    // user requesting to start a new batch
    startSlot(uart_buf[6]);
  }
  if (uart_buf.substring(0, 6) == "!w rt:")
  {
    Serial.println("user wants to tare the scale again");
    int i = uart_buf.substring(6, 7).toInt();
    tareSlot(i - 1, 20);
  }
  if (uart_buf.substring(0, 7) == "!w stp:")
  {
    // user is finished with new batch wizard stop sending
    // readings
    int i = uart_buf.substring(7, 8).toInt();
    keg_slots[i - 1].active = true;
    nb_sending = false;
    sending = false;
  }
  if (uart_buf.substring(0, 6) == "!w ss:")
  {
    Serial.print("user selected slot ");
    Serial.println(uart_buf.substring(6, 7));
    int i = uart_buf.substring(6, 7).toInt();
    selected_sid = i - 1;
    keg_slots[selected_sid].selected = true;
    sending = true;
  }
  if (uart_buf.substring(0, 8) == "!e stup:")
  {
    Serial.println("setting up variables");
    active[0] = uart_buf.substring(8, 9).toInt();
    Serial.print(active[0]);
    if (active[0] = 1)
      keg_slots[0].active = true;
    active[1] = uart_buf.substring(9, 10).toInt();
    Serial.print(active[1]);
    if (active[1] = 1)
      keg_slots[1].active = true;
    active[2] = uart_buf.substring(10, 11).toInt();
    Serial.print(active[2]);
    if (active[2] = 1)
      keg_slots[2].active = true;
    active[3] = uart_buf.substring(11, 12).toInt();
    Serial.print(active[3]);
    if (active[3] = 1)
      keg_slots[3].active = true;
    active[4] = uart_buf.substring(12, 13).toInt();
    Serial.print(active[4]);
    if (active[4] = 1)
      keg_slots[4].active = true;
    active[5] = uart_buf.substring(13, 14).toInt();
    Serial.print(active[5]);
    if (active[5] = 1)
      keg_slots[5].active = true;
    active[6] = uart_buf.substring(14, 15).toInt();
    Serial.print(active[6]);
    if (active[6] = 1)
      keg_slots[6].active = true;
    active[7] = uart_buf.substring(15, 16).toInt();
    Serial.print(active[7]);
    if (active[7] = 1)
      keg_slots[7].active = true;
    uart_buf = "";
  }
  if (uart_buf.substring(0, 6) == "!e rdy")
  {
    
  }
  uart_buf = "";
}

void startSlot(char slot_id)
{
  int i = (int)slot_id;
  i = i - '0';
  i--;
  keg_slots[i].batch_id = uart_buf.substring(8);
  Serial.write("slot id: ");
  Serial.write(slot_id);
  Serial.write("\n");
  tareSlot(i, 10);
  Serial.write("Reading: ");
  Serial.print(reading(i, 20), 4);
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
  nb_sending = true;
}

float reading(int slot_id, int times)
{
  float reading = keg_slots[slot_id].scale.get_units(times);
  float reading_vol = lbsToL(reading);
  return reading_vol;
}

void scheduledUploads()
{
  cur_millis_t1 = millis();
  if (cur_millis_t1 - start_millis_t1 >= upPeriod)
  {
    for (int i = 0; i < 8; i++)
    {
      if (keg_slots[i].active == true)
      {
        float rd = reading(i, 10);
        keg_slots[i].batch_id.trim();
        Serial.write("!t up:");
        String tmp = String(i + 1);
        Serial.write(tmp.c_str());
        Serial.write(" ");
        Serial.write(keg_slots[i].batch_id.c_str());
        Serial.write(" ");
        Serial.print(rd, 4);
        Serial.write("\n");
        Serial2.write("!t up:");
        Serial2.write(tmp.c_str());
        Serial2.write(" ");
        Serial2.write(keg_slots[i].batch_id.c_str());
        Serial2.write(" ");
        Serial2.print(rd, 4);
        Serial2.write("\n");
      }
    }
    start_millis_t1 = cur_millis_t1;
  }
}

// t2
void sendCurrentLevel()
{
  cur_millis_t2 = millis();
  if (cur_millis_t2 - start_millis_t2 >= period)
  {
    if (nb_sending || sending)
    {
      for (int i = 0; i < 8; i++)
      {
        if (keg_slots[i].selected)
        {
          float r = reading(i, 10);
          Serial.write("sending reading: ");
          Serial.print(r, 4);
          Serial.write("\n");
          Serial2.write("!t nr:");
          Serial2.print(r, 4);
          Serial2.write("\n");
        }
      }
    }
    decodeUart();
    start_millis_t2 = cur_millis_t2;
  }
}

void tareSlot(int slot_id, int times)
{
  keg_slots[slot_id].scale.tare(times);
}

float lbsToL(float lbs)
{
  float cubic_feet = lbs / DENSITY;
  // 1 cubic foot = 28.3168 litres or litres = cubic feet / 0.035315
  return cubic_feet / 0.035315;
}
