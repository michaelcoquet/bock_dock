//#include <Arduino.h>
//
///*********
//  Rui Santos
//  Complete project details at http://randomnerdtutorials.com  
//*********/
//
//#include <fs.h>
//#include <Arduino.h>
////#include <hash.h>
//#include <ESP8266WiFi.h>
//#include <DNSServer.h>

//#include "AsyncJson.h"
//#include <ArduinoJson.h>
//#include <ESP8266mDNS.h>
//
//const int relayPin = D1;

// AsyncWebServer server(80);

//
//// Variable to store the HTTP request
//String header;
//
//// Auxiliar variables to store the current output state
//String red_led_state = "off";
//String green_led_state = "off";
//String blue_led_state = "off";
//
//

//
//void setup() {
//
//  //configure the serial port
//  Serial.begin(115200);
//
//  // id/name, placeholder/prompt, default, length
//  AsyncWiFiManagerParameter custom_devicename("DeviceName", "Device Name", deviceName, 40);
//  wifiManager.addParameter(&custom_devicename);
//  wifiManager.setTimeout(180);
//  if(!wifiManager.autoConnect("AutoConnectAP")) {
//    Serial.println("failed to connect and hit timeout");
//    deviceReset();
//  }
//  Serial.println("Wifi Connection Successful");
//
//  //start the web server
//
//  // or use this for auto generated name ESP + ChipID
//  //wifiManager.autoConnect();
//  // if you get here you have connected to the WiFi
////  Serial.println("Connected.");
//  SPIFFS.begin();
//
//  server.serveStatic("/", SPIFFS, "/index.html");
//  server.serveStatic("/main-es5.js", SPIFFS, "/main-es5.js");
//  server.serveStatic("/main-es2015.js", SPIFFS, "/main-es2015.js");
//  server.serveStatic("/polyfills-es5.js", SPIFFS, "/polyfills-es5.js");
//  server.serveStatic("/polyfills-es2015.js", SPIFFS, "/polyfills-es2015.js");
//  server.serveStatic("/runtime-es5.js", SPIFFS, "/runtime-es5.js");
//  server.serveStatic("/runtime-es2015.js", SPIFFS, "/runtime-es2015.js");
//  server.serveStatic("/assets/img/logo.jpg", SPIFFS, "/assets/img/logo.jpg");
//  server.serveStatic("/styles.css", SPIFFS, "/styles.css");
//
//  // server.onNotFound([]() {
//  //   server.send(404, "text/plain", "404: Not Found");
//  // });
//
//  // server.on("/tareCommand", HTTP_GET, [](AsyncWebServerRequest *request){
//  //   Serial.println("server: got tare from client run tareCommand");
//  //   request->send(200, "text/plain", "relay  on");
//  // });
//
//  server.begin();
//
////  wifiManager.reboot();
//}
//
//void tareCommand()
//{
//  Serial.println("Tare command received sending zero signal to selected slot");
//}
//
//
//void loop(){
//}


// Defaulut is SPIFFS, FatFS: only on ESP32, also choose partition scheme w/ ffat. 
// Comment 2 lines below or uncomment only one of them

//#define USE_LittleFS
//#define USE_FatFS // Only ESP32

#include <ArduinoOTA.h>
#ifdef ESP32
 #include <FS.h>
 #ifdef USE_LittleFS
  #define MYFS LITTLEFS
  #include "LITTLEFS.h"
 #elif defined(USE_FatFS)
  #define MYFS FFat
  #include "FFat.h"
 #else
  #define MYFS SPIFFS
  #include <SPIFFS.h>
 #endif
 #include <ESPmDNS.h>
 #include <WiFi.h>
 #include <AsyncTCP.h>
#elif defined(ESP8266)
 #ifdef USE_LittleFS
  #include <FS.h>
  #define MYFS LittleFS
  #include <LittleFS.h> 
 #elif defined(USE_FatFS)
  #error "FatFS only on ESP32 for now!"
 #else
  #define MYFS SPIFFS
 #endif
 #include <ESP8266WiFi.h>
 #include <ESPAsyncTCP.h>
 #include <ESP8266mDNS.h>
#endif
#include <ESPAsyncWebServer.h>
#include <ESPAsyncWiFiManager.h>
#include <SPIFFSEditor.h>

// SKETCH BEGIN
DNSServer dnsServer;
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");
AsyncEventSource events("/events");
AsyncWiFiManager wifiManager(&server, &dnsServer);
char deviceName[40];

//const char* ssid = "dlink_C";
//const char* password = "7D3705181B";
const char* hostName = "esp-async";
const char* http_username = "admin";
const char* http_password = "admin";

void deviceReset();

void setup(){
//  Serial.begin(115200);
//  Serial.setDebugOutput(true);
//  WiFi.mode(WIFI_AP_STA);
//  WiFi.softAP(hostName);
//  WiFi.begin(ssid, password);
//  if (WiFi.waitForConnectResult() != WL_CONNECTED) {
//    Serial.printf("STA: Failed!\n");
//    WiFi.disconnect(false);
//    delay(1000);
//    WiFi.begin(ssid, password);
//  }
//  
//  Serial.print(F("*CONNECTED* IP:"));
//  Serial.println(WiFi.localIP());

//
  //configure the serial port
  Serial.begin(115200);

  // id/name, placeholder/prompt, default, length
  AsyncWiFiManagerParameter custom_devicename("DeviceName", "Device Name", deviceName, 40);
  wifiManager.addParameter(&custom_devicename);
  wifiManager.setTimeout(180);
  if(!wifiManager.autoConnect("AutoConnectAP")) {
    Serial.println("failed to connect and hit timeout");
    deviceReset();
  }
  Serial.println("Wifi Connection Successful");

  //start the web server

  // or use this for auto generated name ESP + ChipID
  //wifiManager.autoConnect();
  // if you get here you have connected to the WiFi
//  Serial.println("Connected.");

  //Send OTA events to the browser
  ArduinoOTA.onStart([]() { events.send("Update Start", "ota"); });
  ArduinoOTA.onEnd([]() { events.send("Update End", "ota"); });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    char p[32];
    sprintf(p, "Progress: %u%%\n", (progress/(total/100)));
    events.send(p, "ota");
  });
  ArduinoOTA.onError([](ota_error_t error) {
    if(error == OTA_AUTH_ERROR) events.send("Auth Failed", "ota");
    else if(error == OTA_BEGIN_ERROR) events.send("Begin Failed", "ota");
    else if(error == OTA_CONNECT_ERROR) events.send("Connect Failed", "ota");
    else if(error == OTA_RECEIVE_ERROR) events.send("Recieve Failed", "ota");
    else if(error == OTA_END_ERROR) events.send("End Failed", "ota");
  });
  ArduinoOTA.setHostname(hostName);
  ArduinoOTA.begin();

  MDNS.addService("http","tcp",80);

//FS
#ifdef USE_FatFS
  if (MYFS.begin(false,"/ffat",3)) { //limit the RAM usage, bottom line 8kb + 4kb takes per each file, default is 10
#else
  if (MYFS.begin()) {
#endif
    Serial.print(F("FS mounted\n"));
  } else {
    Serial.print(F("FS mount failed\n"));  
  }

  // ws.onEvent(onWsEvent);
  // server.addHandler(&ws);

  events.onConnect([](AsyncEventSourceClient *client){
    client->send("hello!",NULL,millis(),1000);
  });
  server.addHandler(&events);

#ifdef ESP32
  server.addHandler(new SPIFFSEditor(MYFS, http_username,http_password));
#elif defined(ESP8266)
  server.addHandler(new SPIFFSEditor(http_username,http_password, MYFS));
#endif
  
  server.on("/heap", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/plain", String(ESP.getFreeHeap()));
  });

  server.serveStatic("/", MYFS, "/").setDefaultFile("index.html");

  server.onNotFound([](AsyncWebServerRequest *request){
    Serial.printf("NOT_FOUND: ");
    if(request->method() == HTTP_GET)
      Serial.printf("GET");
    else if(request->method() == HTTP_POST)
      Serial.printf("POST");
    else if(request->method() == HTTP_DELETE)
      Serial.printf("DELETE");
    else if(request->method() == HTTP_PUT)
      Serial.printf("PUT");
    else if(request->method() == HTTP_PATCH)
      Serial.printf("PATCH");
    else if(request->method() == HTTP_HEAD)
      Serial.printf("HEAD");
    else if(request->method() == HTTP_OPTIONS)
      Serial.printf("OPTIONS");
    else
      Serial.printf("UNKNOWN");
    Serial.printf(" http://%s%s\n", request->host().c_str(), request->url().c_str());

    if(request->contentLength()){
      Serial.printf("_CONTENT_TYPE: %s\n", request->contentType().c_str());
      Serial.printf("_CONTENT_LENGTH: %u\n", request->contentLength());
    }

    int headers = request->headers();
    int i;
    for(i=0;i<headers;i++){
      AsyncWebHeader* h = request->getHeader(i);
      Serial.printf("_HEADER[%s]: %s\n", h->name().c_str(), h->value().c_str());
    }

    int params = request->params();
    for(i=0;i<params;i++){
      AsyncWebParameter* p = request->getParam(i);
      if(p->isFile()){
        Serial.printf("_FILE[%s]: %s, size: %u\n", p->name().c_str(), p->value().c_str(), p->size());
      } else if(p->isPost()){
        Serial.printf("_POST[%s]: %s\n", p->name().c_str(), p->value().c_str());
      } else {
        Serial.printf("_GET[%s]: %s\n", p->name().c_str(), p->value().c_str());
      }
    }

    request->send(404);
  });
  server.onFileUpload([](AsyncWebServerRequest *request, const String& filename, size_t index, uint8_t *data, size_t len, bool final){
    if(!index)
      Serial.printf("UploadStart: %s\n", filename.c_str());
    Serial.printf("%s", (const char*)data);
    if(final)
      Serial.printf("UploadEnd: %s (%u)\n", filename.c_str(), index+len);
  });
  server.onRequestBody([](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){
    if(!index)
      Serial.printf("BodyStart: %u\n", total);
    Serial.printf("%s", (const char*)data);
    if(index + len == total)
      Serial.printf("BodyEnd: %u\n", total);
  });
  server.begin();
}

void loop(){
  ArduinoOTA.handle();
  ws.cleanupClients();
}

void deviceReset()
{
 delay(3000);
 ESP.reset();
 delay(5000);
}