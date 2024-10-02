# IoTProject
IoT module project - Temperature/Humidity sensor with device remote activation using MQTT protocol

# Installation

## mqtt

```bash
$ cd mqtt_client/

# start broker
$ docker-compose up --build
# or
$ docker-compose up -d # detached

# start client
$ npm start
```

## back-end

```bash
$ cd webPage/back-end/

# start database
$ docker-compose up --build
# or
$ docker-compose up -d # detached

# start back-end
$ npm start
```

## front-end

```bash
$ cd webPage/front-end/

# start front-end
$ npm start
```