import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
export declare class MqttService implements OnModuleInit, OnModuleDestroy {
    private client;
    private messageCallback;
    onModuleInit(): void;
    onModuleDestroy(): void;
    connect(): void;
    setMessageCallback(callback: (topic: string, message: string) => void): void;
    subscribeToTopics(): void;
    subscribeToTopic(newTopic: any): void;
    unsubscribeFromTopic(topic: any): void;
    publish(topic: string, message: string): void;
}
