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
int port = 1883;
const char topic_send[] = "/component/data";
const char topic_receive[] = "/alarm/activate"
JSONVar readings;
JSONVar data;
unsigned long lastTime = 0;
unsigned long lastTimeAlarm = 0;
unsigned long timerDelay = 30000;
DHT dht(5, DHT11);
String my_uuid_capteur = "";
String my_uuid_alarm = "";

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

void alarm(int messageSize)
{
    if (messageSize) {
      // we received a message, print out the topic and contents
      Serial.print("Received a message with topic '");
      Serial.print(mqttClient.messageTopic());
      Serial.print("', length ");
      Serial.print(messageSize);
      Serial.println(" bytes:");

      // use the Stream interface to print the contents
      receivedMessage = "";  // Réinitialiser la chaîne de message
      while (mqttClient.available()) {
        receivedMessage += (char)mqttClient.read();  // Stocke chaque caractère
      }
      Serial.println("Message complet reçu : ");
      Serial.println(receivedMessage);
      JSONVar jsonObject = JSON.parse(message);
    }
}

void setup_devices(void) {
  initDHT();

  if (!mqttClient.connect(broker, port)) {
     Serial.println("C'est la merde!!");
  }
  mqttClient.onMessage(alarm);
  mqttClient.subscribe(topic_receive);
}

void setup()
{
  Serial.begin(115200);
  initFS();
  Serial.println("test");
  ESPConnect.autoConnect("Bacchus", "NOGU2024", 600000);
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
    mqttClient.beginMessage(topic_send);
    mqttClient.print(getSensorReadings());
    mqttClient.endMessage();
  }
}

void loop()
{
  mqttClient.poll();
  if (my_uuid_capteur == NULL) {
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
      request->send(LittleFS, "/index.html", "text/html");
    });
  } else {
    send_data();
  }
}
