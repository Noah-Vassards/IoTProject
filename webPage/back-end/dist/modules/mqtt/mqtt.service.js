"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttService = void 0;
const common_1 = require("@nestjs/common");
const mqtt = require("mqtt");
let MqttService = class MqttService {
    onModuleInit() {
        this.connect();
    }
    onModuleDestroy() {
        this.client.end();
    }
    connect() {
        this.client = mqtt.connect('mqtts://localhost:8883', {
            keyPath: '../../core/constants/certs/key.pem',
            certPath: '../../core/constants/key.pem',
            clientId: `nestjs_${Math.random().toString(16).substr(2, 8)}`,
            rejectUnauthorized: false,
            reconnectPeriod: 1000
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
    setMessageCallback(callback) {
        this.messageCallback = callback;
    }
    subscribeToTopics() {
    }
    subscribeToTopic(newTopic) {
        this.client.subscribe(newTopic, (err) => {
            if (err) {
                console.error('Failed to subscribe to', newTopic);
            }
            else {
                console.log('Subscribed to topic', newTopic);
            }
        });
    }
    unsubscribeFromTopic(topic) {
        this.client.unsubscribe(topic, (err) => {
            if (err) {
                console.error('Failed to unsubscribe from', topic);
            }
            else {
                console.log('Unsubscribed from topic', topic);
            }
        });
    }
    publish(topic, message) {
        this.client.publish(topic, message, {}, (err) => {
            if (err) {
                console.error('Failed to publish message:', err);
            }
            else {
                console.log(`Message published to topic ${topic}`);
            }
        });
    }
};
MqttService = __decorate([
    (0, common_1.Injectable)()
], MqttService);
exports.MqttService = MqttService;
//# sourceMappingURL=mqtt.service.js.map