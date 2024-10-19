#include <Arduino.h>
#include <ESP8266WiFi.h>
//#include <PubSubClient.h>
#include <Arduino_JSON.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include "LittleFS.h"
#include <ESPConnect.h>
#include <ArduinoMqttClient.h>
#include "DHT.h"

AsyncWebServer server(80);
WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);
const char broker[] = "192.168.113.190";
int port = 1883;
const char topic_component[] = "/component/data";
const char topic_active_component[] = "/component/new";
const char topic_check_uuid[] = "/check/";
const char topic_validate_uuid[] = "/validate/";
JSONVar readings;
unsigned long lastTime = 0;
unsigned long lastTimeAlarm = 0;
unsigned long timerDelay = 15000;
DHT dht(5, DHT11); // pin D1
String my_uuid_capteur = "uuid8cpt1";
String my_uuid_alarm = "uuid8alr1";
const char topic_activate_alarm[] = "/activate/uuid8alr1";
const char topic_deactivate_alarm[] = "/deactivate/uuid8alr1";
#define LED_PIN 4 // pin D2
#define FAN_PIN 2 // pin D4

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
      activate_alarm();
    } else if (topic ==topic_deactivate_alarm) {
      deactivate_alarm();
    }
    else if (topic == topic_check_uuid + my_uuid_capteur) {
      check_uuid_capteur(jsonObject);
    } else if (topic == topic_check_uuid + my_uuid_alarm) {
      check_uuid_alarm(jsonObject);
    }
  }
}

void setup_devices(void) {
  dht.begin();
  if (!mqttClient.connect(broker, port)) {
     Serial.println("Failed to connect to MQTT");
  }
  mqttClient.onMessage(messages);
  mqttClient.subscribe(topic_activate_alarm);
  mqttClient.subscribe(topic_deactivate_alarm);  
  mqttClient.subscribe(topic_check_uuid + my_uuid_capteur);
  mqttClient.subscribe(topic_check_uuid + my_uuid_alarm);
}

void setup()
{
  Serial.begin(115200);
  //server.begin();
  ESPConnect.autoConnect("Bacchus", "NOGU2024", 60000000);
  if(ESPConnect.begin(&server)){
    Serial.println("Connected to WiFi");
    Serial.println("IPAddress: "+WiFi.localIP().toString());
  }else{
    Serial.println("Failed to connect to WiFi");
  }
  setup_devices();
  pinMode(LED_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW); 
  digitalWrite(FAN_PIN, LOW);
}

String getSensorReadings(void)
{
  readings = JSONVar();
  readings["temperature"] = round(dht.readTemperature());
  readings["humidity"] =  round(dht.readHumidity());
  readings["uuid"] = my_uuid_capteur;
  String jsonString = JSON.stringify(readings);
  Serial.println(jsonString);
  return jsonString;
}

void send_data(void)
{
  if ((millis() - lastTime) > timerDelay) {
    lastTime = millis();
    mqttClient.beginMessage(topic_component);
    mqttClient.print(getSensorReadings());
    mqttClient.endMessage();
  }
}

void loop()
{
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
