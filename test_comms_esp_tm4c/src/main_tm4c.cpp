#include <Energia.h>

void toggle_led(int led_id, char led_state);

const int ledR = RED_LED;
const int ledG = GREEN_LED;
const int ledB = BLUE_LED;

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
  if(Serial2.available()) {
    char led_id = (char)Serial2.read();
    char led_state = (char)Serial2.read();

    if(led_id == '0')
    {
      toggle_led(ledR, led_state);
    }
    else if(led_id == '1')
    {
      toggle_led(ledG, led_state);
    }
    else if(led_id == '2')
    {
      toggle_led(ledB, led_state);
    }
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