#include <ArduinoOTA.h>
#include <FS.h>
#include <LittleFS.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESP8266mDNS.h>
#include <ESPAsyncWebServer.h>
#include <ESPAsyncWiFiManager.h>
#include <SPIFFSEditor.h>

#define MYFS LittleFS
// #define DEBUG_OUTPUT

// SKETCH BEGIN
DNSServer dnsServer;
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");
AsyncEventSource events("/events");
AsyncWiFiManager wifiManager(&server, &dnsServer);
char deviceName[40];

const char *hostName = "esp-async";
const char *http_username = "admin";
const char *http_password = "admin";

void deviceReset();

void onWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len)
{
  if (type == WS_EVT_CONNECT)
  {
#ifdef DEBUG_OUTPUT
    Serial.printf("ws[%s][%u] connect\n", server->url(), client->id());
#endif
    client->ping();
  }
  else if (type == WS_EVT_DISCONNECT)
  {
#ifdef DEBUG_OUTPUT
    Serial.printf("ws[%s][%u] disconnect\n", server->url(), client->id());
#endif
  }
  else if (type == WS_EVT_ERROR)
  {
#ifdef DEBUG_OUTPUT
    Serial.printf("ws[%s][%u] error(%u): %s\n", server->url(), client->id(), *((uint16_t *)arg), (char *)data);
#endif
  }
  else if (type == WS_EVT_PONG)
  {
#ifdef DEBUG_OUTPUT
    Serial.printf("ws[%s][%u] pong[%u]: %s\n", server->url(), client->id(), len, (len) ? (char *)data : "");

#endif
  }
  else if (type == WS_EVT_DATA)
  {
    AwsFrameInfo *info = (AwsFrameInfo *)arg;
    String msg = "";
    if (info->final && info->index == 0 && info->len == len)
    {
      //the whole message is in a single frame and we got all of it's data
#ifdef DEBUG_OUTPUT
      Serial.printf("ws[%s][%u] %s-message[%llu]: ", server->url(), client->id(), (info->opcode == WS_TEXT) ? "text" : "binary", info->len);

#endif

      if (info->opcode == WS_TEXT)
      {
        for (size_t i = 0; i < info->len; i++)
        {
          msg += (char)data[i];
        }
      }
      else
      {
        char buff[3];
        for (size_t i = 0; i < info->len; i++)
        {
          sprintf(buff, "%02x ", (uint8_t)data[i]);
          msg += buff;
        }
      }

      Serial.printf("%s\n", msg.c_str());
    }
  }
}

void setup()
{
  delay(100);
  Serial.begin(115200);
  // id/name, placeholder/prompt, default, length
  AsyncWiFiManagerParameter custom_devicename("DeviceName", "Device Name", deviceName, 40);
  wifiManager.addParameter(&custom_devicename);
  wifiManager.setTimeout(180);
#ifdef DEBUG_OUTPUT
  wifiManager.setDebugOutput(true);
#else
  wifiManager.setDebugOutput(false);
#endif

  if (!wifiManager.autoConnect("Kegerator Connect"))
  {
    Serial.println("failed to connect and hit timeout");
    deviceReset();
  }
#ifdef DEBUG_OUTPUT
  Serial.println("Wifi Connection Successful");
  Serial.print(F("*CONNECTED* IP:"));
  Serial.println(WiFi.localIP());
#endif

  //Send OTA events to the browser
  ArduinoOTA.onStart([]() { events.send("Update Start", "ota"); });
  ArduinoOTA.onEnd([]() { events.send("Update End", "ota"); });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    char p[32];
    sprintf(p, "Progress: %u%%\n", (progress / (total / 100)));
    events.send(p, "ota");
  });
  ArduinoOTA.onError([](ota_error_t error) {
    if (error == OTA_AUTH_ERROR)
      events.send("Auth Failed", "ota");
    else if (error == OTA_BEGIN_ERROR)
      events.send("Begin Failed", "ota");
    else if (error == OTA_CONNECT_ERROR)
      events.send("Connect Failed", "ota");
    else if (error == OTA_RECEIVE_ERROR)
      events.send("Recieve Failed", "ota");
    else if (error == OTA_END_ERROR)
      events.send("End Failed", "ota");
  });
  ArduinoOTA.setHostname(hostName);
  ArduinoOTA.begin();

  //start the web server

  MDNS.addService("http", "tcp", 80);

  if (!MYFS.begin())
  {
#ifdef DEBUG_OUTPUT
    Serial.print(F("FS mount failed\n"));
#endif
  }

  ws.onEvent(onWsEvent);
  server.addHandler(&ws);

  events.onConnect([](AsyncEventSourceClient *client) {
    client->send("hello!", NULL, millis(), 1000);
  });
  server.addHandler(&events);

  server.addHandler(new SPIFFSEditor(http_username, http_password, MYFS));

  server.on("/heap", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(200, "text/plain", String(ESP.getFreeHeap()));
  });

  server.serveStatic("/", MYFS, "/").setDefaultFile("index.html");

  server.begin();
}

void loop()
{
  ArduinoOTA.handle();
  ws.cleanupClients();
}

void deviceReset()
{
  delay(3000);
  ESP.reset();
  delay(5000);
}
