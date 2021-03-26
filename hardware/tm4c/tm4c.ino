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

void toggle_led(int led_id, char led_state);
void decode_buttons();

const int ledR = RED_LED;
const int ledG = GREEN_LED;
const int ledB = BLUE_LED;

String uart_buf;

void decode_msg();
void get_current_level(char slot_id);
void start_slot(char slot_id);
void tare_slot(char slot_id);

typedef struct Slots {
  char batch_id[36];
  bool selected;
  double current_level;
  HX711 scale;
  byte DOUT;
  byte CLK;
} Slot;

Slot keg_slots[8];

void setup()
{
  // initialize ports
  pinMode(ledR, OUTPUT);
  pinMode(ledG, OUTPUT);
  pinMode(ledB, OUTPUT);
  setup_slots();
  Serial.begin(115200); //connected with USB
  delay(100);
  Serial2.begin(115200); //RS232: Rx = PD6; Tx = PD7
  delay(100);
}

void loop()
{
  if (Serial2.available() > 0)
  {
    char recv = Serial2.read();
    uart_buf += recv;
    if (recv == '\n')
    {
      decode_msg();
      uart_buf = "";
    }
  }
  send_current_levels();
}

void setup_slots()
{

  for(int i = 0; i < 8; i++)
  {
    keg_slots[i].selected = false;
    keg_slots[i].DOUT = DOUT[i];
    keg_slots[i].CLK = CLK[i];
  }
}

void decode_msg()
{
#ifdef DEBUG_OUTPUT
  Serial.print(uart_buf);
#endif

  // parse incoming command
  if (uart_buf[0] == '!')
  {
    // signifies command for tm4c
    if (uart_buf[1] == 't')
    {
      tare_slot(uart_buf[2]);
    }
    else if (uart_buf[1] == 'c')
    {
      Serial.write("getting current level\n");
      get_current_level(uart_buf[2]);
    }
  }
  else
  {
#ifdef DEBUG_OUTPUT
    Serial.println("Error: unknown or irrelevant command");
#endif
  }
}

void get_current_level(char slot_id)
{
  int i = (int)slot_id;
  int reading = keg_slots[i].scale.get_units();
  Serial.write("Sending current level: " + reading);
  Serial2.write("!eg" + reading);
}

void start_slot(char slot_id)
{
  int i = (int)slot_id;

  keg_slots[i].scale.begin(DOUT[i], CLK[i]);
  Serial.write("1\n");
  
  keg_slots[i].scale.set_scale(calibration_factor);
  Serial.write("2\n");
  keg_slots[i].scale.tare();
  Serial.write("3\n");
  Serial.write(keg_slots[i].scale.get_units());
  Serial.write("Success: sending ack back\n");
  Serial2.write("!t: ack\n");
}

void send_current_levels() {
  for(int i = 0; i < 8; i++)
  {
    
  }
}

void tare_slot(char slot_id)
{
  Serial.write("tare command received\n");
  start_slot(slot_id);
}

void toggle_led(int led_id, char led_state)
{
  if (led_state >= '0' && led_state <= '9')
  {
    digitalWrite(led_id, led_state - '0');
  }
  else
  {
    Serial.println("error closing");
  }
}
