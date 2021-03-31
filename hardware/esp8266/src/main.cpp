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
#include <ESP8266HTTPClient.h>
#include <ESPAsyncTCP.h>
#include <ESP8266mDNS.h>
#endif
#include <ESPAsyncWebServer.h>
#include <ESPAsyncWiFiManager.h>
#include <WiFiClientSecure.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <ArduinoJson.h>

// #define DEBUG_OUTPUT

// SKETCH BEGIN
DNSServer dnsServer;
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");
AsyncEventSource events("/events");
// AsyncWiFiManager wifiManager(&server, &dnsServer);
char deviceName[40];

String uart_buf;
AsyncWebSocketClient *client_buf;

bool is_new_batch = false;
bool tare_ack = false;
bool nb_readings = false;
bool nb_stop = false;
String web_msg = "";

void uartHandler();
void newBatchHandler();
void decodeUart();
void deviceReset();
String buildJSON(String batch_id, String slot_id, String reading);
void reconnect(String batch_id, String slot_id, String reading);
void callback(char *topic, byte *payload, unsigned int length);
void setup_wifi();

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

const char *AWS_endpoint = "a1g4safb7la8p-ats.iot.us-east-1.amazonaws.com"; //MQTT broker ip

WiFiClientSecure espClient;
PubSubClient client(AWS_endpoint, 8883, callback, espClient); //set  MQTT port number to 8883 as per //standard
long lastMsg = 0;
char msg[50];
int value = 0;

const char* ssid = "dlink_C";
const char* password = "7D3705181B";

void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++)
  {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

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
    client_buf = client;
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

      // for now just relay the command to the tm4c later might need something
      // fancier

      if (msg.substring(0, 6) == "!w nb:")
      {
        web_msg = msg;
        is_new_batch = true;
      }
      else
      {
        Serial.println(msg);
      }
    }
  }
}

void setupCerts()
{
  if (!SPIFFS.begin())
  {
    Serial.println("Failed to mount file system");
    return;
  }

  Serial.print("Heap: ");
  Serial.println(ESP.getFreeHeap());

  // Load certificate file
  File cert = SPIFFS.open("/cert.der", "r"); //replace cert.crt eith your uploaded file name
  if (!cert)
  {
    Serial.println("Failed to open cert file");
  }
  else
    Serial.println("Success to open cert file");

  delay(1000);

  if (espClient.loadCertificate(cert))
    Serial.println("cert loaded");
  else
    Serial.println("cert not loaded");

  // Load private key file
  File private_key = SPIFFS.open("/private.der", "r"); //replace private eith your uploaded file name
  if (!private_key)
  {
    Serial.println("Failed to open private cert file");
  }
  else
    Serial.println("Success to open private cert file");

  delay(1000);

  if (espClient.loadPrivateKey(private_key))
    Serial.println("private key loaded");
  else
    Serial.println("private key not loaded");

  // Load CA file
  File ca = SPIFFS.open("/ca.der", "r"); //replace ca eith your uploaded file name
  if (!ca)
  {
    Serial.println("Failed to open ca ");
  }
  else
    Serial.println("Success to open ca");

  delay(1000);

  if (espClient.loadCACert(ca))
    Serial.println("ca loaded");
  else
    Serial.println("ca failed");
}

void reconnect(String batch_id, String slot_id, String reading)
{
  // Loop until we're reconnected
  if (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESPthing"))
    {
      Serial.println("connected");
      // Once connected, publish an announcement...
      Serial.print("publishing reading: ");
      Serial.println(buildJSON(batch_id, slot_id, reading));
      client.publish("outTopic", buildJSON(batch_id, slot_id, reading).c_str());
      // ... and resubscribe
      client.subscribe("inTopic");
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");

      char buf[256];
      espClient.getLastSSLError(buf, 256);
      Serial.print("WiFiClientSecure SSL error: ");
      Serial.println(buf);

      // Wait 5 seconds before retrying
    }
  }
}

void setup()
{
  delay(100);
  Serial.begin(115200);
  setupCerts();
  setup_wifi();

  MDNS.addService("http", "tcp", 80);

  if (!MYFS.begin())
  {
#ifdef DEBUG_OUTPUT
    Serial.print(F("FS mount failed\n"));
#endif
  }

  ws.onEvent(onWsEvent);
  server.addHandler(&ws);

  server.addHandler(&events);

  server.begin();

  timeClient.begin();
  while (!timeClient.update())
  {
    timeClient.forceUpdate();
  }

  espClient.setX509Time(timeClient.getEpochTime());
}

void loop()
{
  ws.cleanupClients();
  uartHandler();
  newBatchHandler();
}

int b_count = 0;
void newBatchHandler()
{
  // 1. relay the new batch command to the tm4c
  // 2. wait, in a non-blocking way, for ack from tm4c
  //    indicating scale tared
  // 3. receive readings from tm4c on uart until
  //    stop command is received on the websocket
  if (is_new_batch)
  {
    // 1.
    if (b_count == 0)
    {
      b_count++;
      Serial.println(web_msg);
    }
    // 2.
    if (tare_ack && !nb_readings)
    {
      Serial.println("tare ack received");
      nb_readings = true;
    }
    if (nb_stop)
    {
      Serial.println("new batch wizard finished");
      is_new_batch = false;
      tare_ack = false;
      nb_readings = false;
      nb_stop = false;
    }
  }
}

void uartHandler()
{
  if (Serial.available() > 0)
  {
    char recv = Serial.read();
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
  if (uart_buf.substring(0, 6) == "!t nb:")
  {
    tare_ack = true;
    client_buf->printf(uart_buf.c_str());
  }
  if (uart_buf.substring(0, 6) == "!t nr:")
  {
    Serial.write("reading: ");
    Serial.write(uart_buf.c_str());
    client_buf->printf(uart_buf.c_str());
  }
  if (uart_buf.substring(0, 6) == "!t up:")
  {

    // Serial.print("slot_id: " + uart_buf.substring(6,7));
    // if(uart_buf.substring(8,9) == "-")
    // {
    //   Serial.print(" Reading(-): " + uart_buf.substring(8,15));
    //   Serial.print(" Batch_id: " + uart_buf.substring(16));
    // }
    // else
    // {
    //   Serial.print(" Reading(+): " + uart_buf.substring(8,14));
    //   Serial.println(" Batch_id: " + uart_buf.substring(15));
    // }
    // Serial.print("\n");
    String sid = uart_buf.substring(6, 7);
    String bid;
    String rdng;
    bid = uart_buf.substring(8, 44);
    rdng = uart_buf.substring(45);
    // if (uart_buf.substring(8, 9) == "-")
    // {
    //   rdng = uart_buf.substring(8, 15);
      
    // }
    // else
    // {
    //   rdng = uart_buf.substring(8, 14);
    //   bid = uart_buf.substring(15, 51);
    // }

    if (!client.connected())
    {
      reconnect(bid, sid, rdng);
    }
    client.loop();
  }
}


void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  espClient.setBufferSizes(512, 512);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  timeClient.begin();
  while(!timeClient.update()){
    timeClient.forceUpdate();
  }

  espClient.setX509Time(timeClient.getEpochTime());

}

String buildJSON(String batch_id, String slot_id, String reading)
{
  reading.trim();
  return "{\"batch_id\":\"" + batch_id + "\",\"slot_id\":\"" + slot_id + "\",\"reading\":\"" + reading + "\"}";
}

void deviceReset()
{
  delay(3000);
  ESP.reset();
  delay(5000);
}
