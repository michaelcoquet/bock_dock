#include <Arduino.h>
#include <Arduino_JSON.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <DNSServer.h>
#include <WiFiManager.h>         // https://github.com/tzapu/WiFiManager
#include <TaskScheduler.h>

void http_set_chart(WiFiClient, String);
String http_get_value(WiFiClient, String);
bool button_state(String);
void check_buttons();
void write_v0();
void conn_status();

const String api_key = "uknNrncEDa4KlhypVm3fCxtYqHRyg453"; // blynk api authentication code
const String server_url = "http://blynk-cloud.com/";

// Variable to store the HTTP request
String header;

// Auxiliar variables to store the current output state
String red_led_state = "off";
String green_led_state = "off";
String blue_led_state = "off";

// For the cooperative scheduler
Scheduler runner;

// declare tasks
Task get_button_states(20, TASK_FOREVER, &check_buttons);
Task write_to_blynk_v0(15000, TASK_FOREVER, &write_v0);
Task check_connection(1000, TASK_FOREVER, &conn_status);

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
    // ESP.reset();
    //  wifiManager.reboot();

    runner.addTask(get_button_states);
    runner.addTask(write_to_blynk_v0);
    runner.addTask(check_connection);

    get_button_states.enable();
    write_to_blynk_v0.enable();
    check_connection.enable();
}

void loop() {
  runner.execute();
}

void http_set_chart(WiFiClient client, String path)
{
  HTTPClient http;
  // Serial.println("Trying to connect to path: " + path);

  if(http.begin(client, path.c_str()))
  {            
    int httpResponseCode = http.GET();

    if(httpResponseCode != 200)
    {
      // TODO: handle other response codes here
      // Serial.println("response code received = " + String(httpResponseCode));
    }
    else
    {
      // Serial.println("Successfully sent data to blynk");
    }
  }
  else
  {
    // Serial.println("ERROR: http.begin()");
  }
  http.end();
}

String http_get_value(WiFiClient client, String path)
{
  HTTPClient http;
  // Serial.println("Trying to connect to path: " + path);

  if(http.begin(client, path.c_str()))
  {            
    int httpResponseCode = http.GET();
    // Serial.println("response code received = " + String(httpResponseCode));
    if(httpResponseCode != 200)
    {
      // TODO: handle other response codes here
      return "";
    }
    return http.getString();
  }
  else
  {
    // Serial.println("ERROR: http.begin()");
    return "";
  }
  http.end();
  return "";
}

bool button_state(String http_string)
{
  JSONVar myObject = JSON.parse(http_string);
  
  // JSON.typeof(jsonVar) can be used to get the type of the var
  if (JSON.typeof(myObject) == "undefined") {
    // Serial.println("Parsing input failed!");
    return false;
  }

  char val[2];
  strncpy(val, myObject[0], sizeof(val));

  if(strcmp(val, "0") == 0)
  {
    return false;
  } 
  else if (strcmp(val, "1") == 0)
  {
    return true;
  }

  return false;
}

void write_v0() {
  WiFiClient client;
  String chart_data_path = server_url + api_key + "/update/V0" + "?value=" + String(random(1, 420));

  // send data to blynk chart esp_in
  http_set_chart(client, chart_data_path);
}

void check_buttons() {
  WiFiClient client;

  String b1_path = server_url + api_key + "/get/V1";
  String b2_path = server_url + api_key + "/get/V2";
  String b3_path = server_url + api_key + "/get/V3";
  
  if (button_state(http_get_value(client, b1_path)) == true) 
  {
    Serial.println("01");
  }
  else 
  {
    Serial.println("00");
  }

  if (button_state(http_get_value(client, b2_path)) == true) 
  {
    Serial.println("11");
  }
  else 
  {
    Serial.println("10");
  }

  if (button_state(http_get_value(client, b3_path)) == true) 
  {
    Serial.println("21");
  }
  else 
  {
    Serial.println("20");
  }
}

void conn_status() {
  if(WiFi.status() != WL_CONNECTED) {
    // Serial.println("esp restarting trying to reconnect to wifi");
    ESP.restart();
  }
}
