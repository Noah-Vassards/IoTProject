#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include "LittleFS.h"
#include <Arduino_JSON.h>
#include <ESPConnect.h>
#include <ArduinoMqttClient.h>
#include "DHT.h"

AsyncWebServer server(80);
WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

const char broker[] = "192.168.212.229";
int port = 8883;
const char topic_component[] = "/component/data";
const char topic_active_component[] = "/component/new";
const char topic_alarm[] = "/alarm/activate";
const char topic_active_alarm[] = "/alarm/activate";
const char topic_check_uuid[] = "/check/";
const char topic_validate_uuid[] = "/check/";
JSONVar readings;
unsigned long lastTime = 0;
unsigned long lastTimeAlarm = 0;
unsigned long timerDelay = 30000;
DHT dht(5, DHT11);
String my_uuid_capteur = "";
String my_uuid_alarm = "";
int LED = 0;
int VENTILLO = 0;

void initDHT(void)
{
  dht.begin();
}

void initFS(void)
{
  if (!LittleFS.begin()) {
    Serial.println("An error has occurred while mounting LittleFS");
  }
  Serial.println("LittleFS mounted successfully");
}

String validate()
{
  readings = JSONVar();
  readings["validate"] = true;
  String jsonString = JSON.stringify(readings);
  return jsonString;
}

void check_uuid_capteur(JSONVar jsonObject)
{
  if (jsonObject.hasOwnProperty("uuid_alarm")) {
    String uuid_received_capteur = (const char*)jsonObject["uuid"];
    if (uuid_received_capteur == my_uuid_capteur) {
      Serial.println("UUID du capteur valide. Réponse en cours...");
      mqttClient.beginMessage(topic_validate_uuid + my_uuid_capteur);
      mqttClient.print(validate());
      mqttClient.endMessage();
    } else {
      Serial.println("UUID du capteur ou de l'alarm invalide.");
    }
  } else {
    Serial.println("Le champ 'uuid' est manquant dans le message.");
  }
}

void check_uuid_alarm(JSONVar jsonObject)
{
  if (jsonObject.hasOwnProperty("uuid_alarm")) {
    String uuid_received_alarm = (const char*)jsonObject["uuid"];
    if (uuid_received_alarm == my_uuid_alarm) {
      Serial.println("UUID du capteur valide. Réponse en cours...");
      mqttClient.beginMessage(topic_validate_uuid + my_uuid_alarm);
      mqttClient.print(validate());
      mqttClient.endMessage();
    } else {
      Serial.println("UUID du capteur ou de l'alarm invalide.");
    }
  } else {
    Serial.println("Le champ 'uuid' est manquant dans le message.");
  }
}

void alarm(JSONVar jsonObject)
{
  if (jsonObject.hasOwnProperty("uuid")) {
    String uuid_received_alarm = (const char*)jsonObject["uuid"];
    if (uuid_received_alarm == my_uuid_alarm) {
      digitalWrite(LED, HIGH);
      digitalWrite(VENTILLO, HIGH);
    }
  }
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

    // Gestion en fonction du topic
    if (topic == topic_alarm) {
      alarm(jsonObject);
    }
    else if (topic == topic_check_uuid + my_uuid_capteur) {
      check_uuid_capteur(jsonObject);
    } else if (topic == topic_check_uuid + my_uuid_alarm) {
      check_uuid_alarm(jsonObject);
    }
  }
}

void setup_devices(void) {
  initDHT();

  if (!mqttClient.connect(broker, port)) {
     Serial.println("C'est la merde!!");
  }
  mqttClient.onMessage(messages);
  mqttClient.subscribe(topic_component);
  mqttClient.subscribe(topic_check_uuid + my_uuid_capteur);
  mqttClient.subscribe(topic_check_uuid + my_uuid_alarm);
}

void setup()
{
  Serial.begin(115200);
  initFS();
  Serial.println("test");
  ESPConnect.autoConnect("Bacchus", "NOGU2024", 60000000);
  Serial.println("auto connect");
  if(ESPConnect.begin(&server)){
    Serial.println("Connected to WiFi");
    Serial.println("IPAddress: "+WiFi.localIP().toString());
  }else{
    Serial.println("Failed to connect to WiFi");
  }
  setup_devices();
  server.begin();
}

String getSensorReadings(void)
{
  readings = JSONVar();
  readings["temperature"] = String(dht.readTemperature());
  readings["humidity"] =  String(dht.readHumidity());
  readings["uuid"] = my_uuid_capteur;
  String jsonString = JSON.stringify(readings);
  return jsonString;
}

void send_data(void)
{
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if ((millis() - lastTime) > timerDelay) {
    lastTime = millis();
    mqttClient.beginMessage(topic_component);
    mqttClient.print(getSensorReadings());
    mqttClient.endMessage();
  }
}

void loop()
{
  Serial.println("wait");
  mqttClient.poll();
  send_data();
}
