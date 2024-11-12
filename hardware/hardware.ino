#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <Arduino_JSON.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include "LittleFS.h"
#include <ESPConnect.h>
#include <ArduinoMqttClient.h>
#include "DHT.h"
#include <ESP8266mDNS.h>

const char caCert[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
MIIDcTCCAlkCFCUQnuGJ3Zb53stIH9QcesBLpLeeMA0GCSqGSIb3DQEBCwUAMHUx
CzAJBgNVBAYTAkZSMRYwFAYDVQQIDA1JbGUgZGUgRnJhbmNlMQ4wDAYDVQQHDAVQ
YXJpczEQMA4GA1UECgwHQmFjY2h1czEUMBIGA1UECwwLQmFjY2h1c19pb3QxFjAU
BgNVBAMMDW5vZGUxLmVtcXguaW8wHhcNMjQxMDA3MjEzNjE3WhcNMjUxMDA3MjEz
NjE3WjB1MQswCQYDVQQGEwJGUjEWMBQGA1UECAwNSWxlIGRlIEZyYW5jZTEOMAwG
A1UEBwwFUGFyaXMxEDAOBgNVBAoMB0JhY2NodXMxFDASBgNVBAsMC0JhY2NodXNf
aW90MRYwFAYDVQQDDA1ub2RlMS5lbXF4LmlvMIIBIjANBgkqhkiG9w0BAQEFAAOC
AQ8AMIIBCgKCAQEAmx+PPruct+LHOOXoYcfBfza6U3DIB9lG1WYMYSK8j/jeWKnm
WjnWtMAFAfzPuXxPplztkNP00WB3ORTNNmzA85rm9GVUEBdukwPK5b6ZcNM0DKpB
4O7bSIEa1GVHUz96oE2ddTpxxmgI1sVbNeKobLAYyQaaAcdjd1YkyWuXzUdo54us
7TkHoNJ2c8AaxwgL+qRuhIt4XEXhEnk27P0z6v2LI31EdHaXKNBwkxqYOVqj0i72
oytKqRdof9cI7HsdaWtytj97kW44YTBALM0sIOx32TIiw6DNc9WjQVjayvo609im
1NcpvYYjJJHiOIeHsUpfs5ndzGPHkvcnivKk+wIDAQABMA0GCSqGSIb3DQEBCwUA
A4IBAQCDcIPEQCDd4C2ZVZgvuUNd86AcRC/PZ6VGjhYVl6XYUWUSU8MSFGwKW0Kr
nFYxZhTCQivK6OSrseUjSmYWM00cEsc9YspBnRWCoRGAjxO+ni/nWb5pNxhy10p7
+QhV2Z0bF0toKJHlWwTR1J8rbAsfIasa+NxM37gKn2TSTtdyxVaWLddOP+6bIq4E
5Jg0zCEdJkQrR2oygf7OX/CnFfYF/+FQaGXVnKRzZFzusihPUwKCVI4nxpcSFGfc
WhOfnHOkTam98P8Haldwz+ft3hnv6sBik5p0rFBCCpmzOIqLEi7C2Olc50rTq1tA
vwvzQSc3quFKX2bcNWb3yXtCMgsa
-----END CERTIFICATE-----
)EOF";
const uint8_t mqttCertFingerprint[] = {
    0x2C, 0xDB, 0x7C, 0xBA, 0x72, 0x70, 0xBC, 0x6A, 0xBB, 0xEB,
    0xF5, 0x92, 0xB8, 0x5F, 0x8C, 0xE3, 0x3B, 0xA0, 0x45, 0xA6
};


AsyncWebServer server(80);
X509List caCertX509(caCert); 
WiFiClientSecure wifiClient;
MqttClient mqttClient(wifiClient);
const char broker[] = "35.180.242.193";
int port = 8883;
const char topic_component[] = "/component/data";
const char topic_active_component[] = "/component/new";
const char topic_check_uuid[] = "/check/";
const char topic_validate_uuid[] = "/validate/";
JSONVar readings;
unsigned long lastTime = 0;
unsigned long lastTimeAlarm = 0;
unsigned long timerDelay = 15000;
DHT dht(5, DHT11); // pin D1

#define LED_PIN 4 // pin D2
#define FAN_PIN 2 // pin D4
uint32_t my_uuid = ESP.getChipId();
String my_uuid_capteur = String(my_uuid); // Convertir l'ID en String
String my_uuid_alarm = my_uuid_capteur + "A"; // Concaténer "A" à l'UUID du capteur
String topic_activate_alarm = "/activate/" + my_uuid_alarm;
String topic_deactivate_alarm = "/deactivate/" + my_uuid_alarm;
bool set_user = true;

String validate()
{
  readings = JSONVar();
  readings["validate"] = true;
  String jsonString = JSON.stringify(readings);
  return jsonString;
}

void check_uuid_capteur(JSONVar jsonObject)
{
  Serial.println("UUID du capteur valide. Réponse en cours...");
  mqttClient.beginMessage(topic_validate_uuid + my_uuid_capteur);
  mqttClient.print(validate());
  mqttClient.endMessage();
}

void check_uuid_alarm(JSONVar jsonObject)
{
  Serial.println("UUID du capteur valide. Réponse en cours...");
  mqttClient.beginMessage(topic_validate_uuid + my_uuid_alarm);
  mqttClient.print(validate());
  mqttClient.endMessage();
}

void activate_alarm()
{
  digitalWrite(LED_PIN, HIGH);
  digitalWrite(FAN_PIN, HIGH);
}

void deactivate_alarm()
{
  digitalWrite(LED_PIN, LOW);
  digitalWrite(FAN_PIN, LOW);
}

void messages(int messageSize)
{
  if (messageSize) {
    String topic = mqttClient.messageTopic();
    Serial.print("Message reçu sur le topic : ");
    Serial.println(topic);
    String receivedMessage = "";
    while (mqttClient.available()) {
      receivedMessage += (char)mqttClient.read();
    }
    Serial.println("Message complet reçu : ");
    Serial.println(receivedMessage);
    JSONVar jsonObject = JSON.parse(receivedMessage);
    if (JSON.typeof(jsonObject) == "undefined") {
      Serial.println("Erreur lors de l'analyse du message JSON");
      return;
    }
    if (topic == topic_activate_alarm) {
      Serial.println("Activate Alarm");
      activate_alarm();
    } else if (topic == topic_deactivate_alarm) {
      Serial.println("Deactivate Alarm");
      deactivate_alarm();
    }
    else if (topic == topic_check_uuid + my_uuid_capteur) {
      check_uuid_capteur(jsonObject);
    } else if (topic == topic_check_uuid + my_uuid_alarm) {
      check_uuid_alarm(jsonObject);
    }
  }
}

void initFS(void)
{
  if (!LittleFS.begin()) {
    Serial.println("An error has occurred while mounting LittleFS");
  }
  Serial.println("LittleFS mounted successfully");
  File file = LittleFS.open("/signup.html", "r");
  if(!file){
    Serial.println("Failed to open file for reading");
    return;
  }
}

void initDNSWifi()
{
  if (!MDNS.begin("bacchus_wifi")) {  // Replace "esp8266" with the desired local name
    Serial.println("Error setting up mDNS responder");
  } else {
    Serial.println("SUCCES setting up mDNS responder");
  }
  MDNS.addService("http", "tcp", 80);
}

void initDNS()
{
  if (!MDNS.begin("bacchus")) {  // Replace "esp8266" with the desired local name
    Serial.println("Error setting up mDNS responder");
  } else {
    Serial.println("SUCCES setting up mDNS responder");
  }
  MDNS.addService("http", "tcp", 80);
}

void setup_devices(void) {
  dht.begin();
  initFS();
  wifiClient.setTrustAnchors(&caCertX509);
  wifiClient.allowSelfSignedCerts();
  bool success = false;
  Serial.print("Verifying TLS connection");
  success = wifiClient.connect(broker, port);
  if (success) {
    Serial.println("Connection complete, valid cert, valid fingerprint.");
  }
  else {
    Serial.println("Connection failed!");
  }
  if (!mqttClient.connect(broker, port)) {
     Serial.println("Failed to connect to MQTT");
  }
  Serial.print("topic_activate_alarm:");
  Serial.println(topic_activate_alarm);
  Serial.print("topic_deactivate_alarm:");
  Serial.println(topic_deactivate_alarm);
  mqttClient.onMessage(messages);
  mqttClient.subscribe(topic_activate_alarm);
  mqttClient.subscribe(topic_deactivate_alarm);  
  mqttClient.subscribe(topic_check_uuid + my_uuid_capteur);
  mqttClient.subscribe(topic_check_uuid + my_uuid_alarm);
}

void setup()
{
  Serial.begin(115200);
  while (!ESPConnect.begin(&server)) {
    ESPConnect.autoConnect("Bacchus", "NOGU2024", 6000000);
    /*while (!ESPConnect.begin(&server)) {
      Serial.println("Tentative de connexion WiFi...");
      delay(1000);  // Attendre 1 seconde avant de réessayer pour éviter une boucle trop rapide
    }*/
    if(ESPConnect.begin(&server)){
      Serial.println("Connected to WiFi");
      Serial.println("IPAddress: "+WiFi.localIP().toString());
      initDNS();
    }else{
      Serial.println("Failed to connect to WiFi");
    }
  }
  setup_devices();
  pinMode(LED_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW); 
  digitalWrite(FAN_PIN, LOW);
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
      request->redirect("/login.html");
  });
  server.on("/login.html", HTTP_GET, [](AsyncWebServerRequest *request){
      request->send(LittleFS, "/login.html", "text/html");
  });
  server.on("/signup.html", HTTP_GET, [](AsyncWebServerRequest *request){
      request->send(LittleFS, "/signup.html", "text/html");
  });
  server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request){
      request->send(LittleFS, "/style.css", "text/css");
  });
  server.on("/script.js", HTTP_GET, [](AsyncWebServerRequest *request){
      request->send(LittleFS, "/script.js", "application/javascript");
  });
  server.on("/getUUID", HTTP_GET, [](AsyncWebServerRequest *request){
      String uuid = "{\"uuid\": \"" + String(my_uuid, HEX) + "\"}";  // UUID en hexadécimal
      request->send(200, "application/json", uuid);
  });
  server.begin();
}

String getSensorReadings(void)
{
  readings = JSONVar();

  float tempValue = dht.readTemperature();
  float humidityValue = dht.readHumidity();

  // Vérifie si l'une des valeurs est NAN ou invalide
  if (isnan(round(tempValue)) || isnan(round(humidityValue))) {
    return "";
  }
  readings["temperature"] = round(tempValue);
  readings["humidity"] =  round(humidityValue);
  readings["uuid"] = my_uuid_capteur;
  String jsonString = JSON.stringify(readings);
  Serial.println(jsonString);
  return jsonString;
}

void send_data(void)
{
  if ((millis() - lastTime) > timerDelay) {
    String jsonDataCapteur = getSensorReadings();
    if (jsonDataCapteur == "") {
      return;
    }
    lastTime = millis();
    mqttClient.beginMessage(topic_component);
    mqttClient.print(getSensorReadings());
    mqttClient.endMessage();
  }
}

void loop()
{
  MDNS.update();
  mqttClient.poll();
  if (!mqttClient.connected()) {
    if (mqttClient.connect(broker, port)) {
      Serial.println("Reconnected to MQTT broker");
      mqttClient.subscribe(topic_check_uuid + my_uuid_capteur);
      mqttClient.subscribe(topic_check_uuid + my_uuid_alarm);
    } else {
      Serial.print("Failed to reconnect, error state: ");
      delay(5000);
    }
  }
  mqttClient.poll();
  send_data();
}
