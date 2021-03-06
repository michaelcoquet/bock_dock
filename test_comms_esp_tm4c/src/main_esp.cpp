#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <DNSServer.h>
#include <WiFiManager.h>         // https://github.com/tzapu/WiFiManager


const String api_key = "uknNrncEDa4KlhypVm3fCxtYqHRyg453";  // blynk api authentication code
const String server_url = "http://blynk-cloud.com/";
const String pin_name = "V0";


// // Set web server port number to 80
// WiFiServer server(80);

// Variable to store the HTTP request
String header;

// Auxiliar variables to store the current output state
String red_led_state = "off";
String green_led_state = "off";
String blue_led_state = "off";

void setup() {
  Serial.begin(115200);

  // WiFiManager
  // Local intialization. Once its business is done, there is no need to keep it around
  WiFiManager wifiManager;
  
  // Uncomment and run it once, if you want to erase all the stored information
  //wifiManager.resetSettings();
  
  // set custom ip for portal
  //wifiManager.setAPConfig(IPAddress(10,0,1,1), IPAddress(10,0,1,1), IPAddress(255,255,255,0));

  // fetches ssid and pass from eeprom and tries to connect
  // if it does not connect it starts an access point with the specified name
  // here  "AutoConnectAP"
  // and goes into a blocking loop awaiting configuration
  wifiManager.autoConnect("Kegerator Connect");
  // or use this for auto generated name ESP + ChipID
  //wifiManager.autoConnect();
  // if you get here you have connected to the WiFi
//  Serial.println("Connected.");
  
  // server.begin();
  ESP.reset();
//  wifiManager.reboot();
}

void loop() {
    if(WiFi.status() == WL_CONNECTED) {
      HTTPClient http;

      String path = server_url + api_key + "/update/" +  pin_name + "?value=" + String(random(1,420));

      Serial.println("Trying to connect to path: " + path);

      http.begin(path.c_str());

      int httpResponseCode = http.GET();

      Serial.println("response code received = " + String(httpResponseCode));

      http.end();
    }
    Serial.println("Waiting...");
  
    // wait 30 seconds before sending another value
    delay(10000);
}

// void loop() {
//   WiFiClient client = server.available();   // Listen for incoming clients

//   if (client) {                             // If a new client connects,
// //    Serial.println("New Client.");          // print a message out in the serial port
//     String currentLine = "";                // make a String to hold incoming data from the client
//     while (client.connected()) {            // loop while the client's connected
//       if (client.available()) {             // if there's bytes to read from the client,
//         char c = client.read();             // read a byte, then
// //        Serial.write(c);                    // print it out the serial monitor
//         header += c;
//         if (c == '\n') {                    // if the byte is a newline character
//           // if the current line is blank, you got two newline characters in a row.
//           // that's the end of the client HTTP request, so send a response:
//           if (currentLine.length() == 0) {
//             // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
//             // and a content-type so the client knows what's coming, then a blank line:
//             client.println("HTTP/1.1 200 OK");
//             client.println("Content-type:text/html");
//             client.println("Connection: close");
//             client.println();
            
//             // turns the GPIOs on and off
//             if (header.indexOf("GET /0/1") >= 0) {
//               Serial.println("01");
//               red_led_state = "on";
//             } else if (header.indexOf("GET /0/0") >= 0) {
//               Serial.println("00");
//               red_led_state = "off";
//             } else if (header.indexOf("GET /2/1") >= 0) {
//               Serial.println("21");
//               blue_led_state = "on";
//             } else if (header.indexOf("GET /2/0") >= 0) {
//               Serial.println("20");
//               blue_led_state = "off";
//             } else if (header.indexOf("GET /1/1") >= 0) {
//               Serial.println("11");
//               green_led_state = "on";
//             } else if (header.indexOf("GET /1/0") >= 0) {
//               Serial.println("10");
//               green_led_state = "off";
//             }
            
//             // Display the HTML web page
//             client.println("<!DOCTYPE html><html>");
//             client.println("<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
//             client.println("<link rel=\"icon\" href=\"data:,\">");
//             // CSS to style the on/off buttons 
//             // Feel free to change the background-color and font-size attributes to fit your preferences
//             client.println("<style>html { font-family: Helvetica; display: inline-block; margin: 0px auto; text-align: center;}");
//             client.println(".button { background-color: #195B6A; border: none; color: white; padding: 16px 40px;");
//             client.println("text-decoration: none; font-size: 30px; margin: 2px; cursor: pointer;}");
//             client.println(".button2 {background-color: #77878A;}</style></head>");
            
//             // Web Page Heading
//             client.println("<body><h1>Kegerator Monitor</h1>");
            
//             // Display current state, and ON/OFF buttons for Red LED  
//             client.println("<p>Red LED - State " + red_led_state + "</p>");
//             // If the red_led_state is off, it displays the ON button       
//             if (red_led_state=="off") {
//               client.println("<p><a href=\"/0/1\"><button class=\"button\">ON</button></a></p>");
//             } else {
//               client.println("<p><a href=\"/0/0\"><button class=\"button button2\">OFF</button></a></p>");
//             } 
               
//             // Display current state, and ON/OFF buttons for Blue LED 
//             client.println("<p>Blue LED - State " + blue_led_state + "</p>");
//             // If the blue_led_state is off, it displays the ON button       
//             if (blue_led_state=="off") {
//               client.println("<p><a href=\"/2/1\"><button class=\"button\">ON</button></a></p>");
//             } else {
//               client.println("<p><a href=\"/2/0\"><button class=\"button button2\">OFF</button></a></p>");
//             }

//             // Display current state, and ON/OFF buttons for Green LED
//             client.println("<p>Green LED - State " + green_led_state + "</p>");
//             // If the blue_led_state is off, it displays the ON button       
//             if (green_led_state=="off") {
//               client.println("<p><a href=\"/1/1\"><button class=\"button\">ON</button></a></p>");
//             } else {
//               client.println("<p><a href=\"/1/0\"><button class=\"button button2\">OFF</button></a></p>");
//             }
//             client.println("</body></html>");
            
//             // The HTTP response ends with another blank line
//             client.println();
//             // Break out of the while loop
//             break;
//           } else { // if you got a newline, then clear currentLine
//             currentLine = "";
//           }
//         } else if (c != '\r') {  // if you got anything else but a carriage return character,
//           currentLine += c;      // add it to the end of the currentLine
//         }
//       }
//     }
//     // Clear the header variable
//     header = "";
//     // Close the connection
//     client.stop();
// //    Serial.println("Client disconnected.");
// //    Serial.println("");
//   }
// }
