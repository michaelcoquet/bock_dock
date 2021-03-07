#include <Energia.h>

void toggle_led(int led_id, char led_state);
void decode_buttons();

const int ledR = RED_LED;
const int ledG = GREEN_LED;
const int ledB = BLUE_LED;

String uart_buf;

void setup() {
  // initialize ports:
  pinMode(ledR, OUTPUT);      
  pinMode(ledG, OUTPUT);      
  pinMode(ledB, OUTPUT);      
  Serial.begin(115200); //connected with USB
  delay(100);
  Serial2.begin(115200); //RS232: Rx = PD6; Tx = PD7
  delay(100);
}

void loop() {
  if(Serial2.available() > 0)
  {
    char recv = Serial2.read();
    uart_buf += recv;
    if(recv == '\n') {
      decode_buttons();
      uart_buf = "";
    }
  }
}

void decode_buttons()
{
  if(uart_buf[0] == '0')
  {
    toggle_led(ledR, uart_buf[1]);
  }
  else if(uart_buf[0] == '1')
  {
    toggle_led(ledG, uart_buf[1]);
  }
  else if(uart_buf[0] == '2')
  {
    toggle_led(ledB, uart_buf[1]);
  }
}

void toggle_led(int led_id, char led_state) {
    if(led_state >= '0' && led_state <= '9'){
      digitalWrite(led_id, led_state - '0');
    }
    else {
      Serial.println("error closing");
    }
}
