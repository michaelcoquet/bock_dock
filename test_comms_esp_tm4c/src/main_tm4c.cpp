#include "Energia.h"

void setup() {
  // initialize ports:
  Serial.begin(115200); //connected with USB
  delay(100);
  Serial2.begin(115200); //RS232: Rx = PD6; Tx = PD7
  delay(100);
}

void loop() {
}

void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    //send it to RS232
    Serial2.print(inChar); 
  }
  while (Serial2.available()) {
    // get the new byte:
    char inChar = (char)Serial2.read();
    //send it to UI
    Serial.print(inChar); 
  } 
}