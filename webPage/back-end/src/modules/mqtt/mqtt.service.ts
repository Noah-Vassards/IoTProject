import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private client: mqtt.MqttClient;
  private messageCallback: (topic: string, message: string) => void;

  onModuleInit() {
    this.connect();
  }

  onModuleDestroy() {
    this.client.end();
  }

  connect() {
    this.client = mqtt.connect('mqtt://localhost:1883', {
      // keyPath: '../../core/constants/certs/key.pem',
      // certPath: '../../core/constants/key.pem',
      clientId: `nestjs_${Math.random().toString(16).substr(2, 8)}`,  // Un ID unique
      rejectUnauthorized: false,
      reconnectPeriod: 5000
    });

    this.client.on('connect', () => {
      console.log('MQTT connected');
      this.subscribeToTopics();
    });

    this.client.on('error', (err) => {
      console.error('MQTT connection error:', err);
    });

    this.client.on('message', (topic, message) => {
      if (this.messageCallback) {
        this.messageCallback(topic, message.toString());
      }
    });
  }

  setMessageCallback(callback: (topic: string, message: string) => void) {
    this.messageCallback = callback;
  }

  subscribeToTopics() {

  }

  subscribeToTopic(newTopic) {
    this.client.subscribe(newTopic, (err) => {
      if (err) {
        console.error('Failed to subscribe to', newTopic)
      } else {
        console.log('Subscribed to topic', newTopic)
      }
    })
  }

  unsubscribeFromTopic(topic) {
    this.client.unsubscribe(topic, (err) => {
      if (err) {
        console.error('Failed to unsubscribe from', topic)
      } else {
        console.log('Unsubscribed from topic', topic)
      }
    })
  }

  publish(topic: string, message: string) {
    this.client.publish(topic, message, {}, (err) => {
      if (err) {
        console.error('Failed to publish message:', err);
      } else {
        console.log(`Message published to topic ${topic}`);
      }
    });
  }
}
