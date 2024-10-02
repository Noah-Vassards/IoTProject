const mqtt = require('mqtt')
const fs = require('fs')
const utils = require('./utils')

const host = 'node1.emqx.io'
const port = '8883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtts://${host}:${port}`
console.log(connectUrl)

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem'),
  rejectUnauthorized: false,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
})

const registerNewData = '/component/data'
const activatingAlarm = '/alarm/activate'

client.on('connect', () => {
  console.log('Connected')

  client.subscribe([registerNewData], () => {
    console.log('Subscribe to topic', registerNewData)
  })
})

client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
  const data = JSON.parse(payload.toString())
  console.log(data)
  if (topic === registerNewData) {
    utils.sendRequest(`http://localhost:3001/dev/components/${data.uuid}/newData`, 'POST', { date: utils.getFormattedDate(), temperature: data.temperature, humidity: data.humidity })
      .then(() => {
        console.log('New data registered')
        utils.sendRequest(`http://localhost:3001/dev/alarms`, 'GET')
          .then((alarms) => {
            alarms.forEach((a) => {
              if (a.linkedComponentUuid === data.uuid) {
                if (data.temperature < a.temperatureRange[0] || data.temperature > a.temperatureRange[1] || data.humidity < a.humidityRange[0] || data.humidity > a.humidityRange[1]) {
                  console.log('Activating alarm', a.uuid)
                  utils.sendRequest(`http://localhost:3001/dev/alarms/${a.uuid}/activate/true`, 'PATCH')
                    .then(() => console.log('alarm', a.uuid, 'activated'))
                    .catch(e => console.error(e))
                  client.publish(activatingAlarm, JSON.stringify({ uuid: a.uuid }), { qos: 1, retain: false }, (error) => {
                    if (error) {
                      console.error(error)
                    }
                  })
                } else {
                  console.log('Deactivating alarm', a.uuid)
                  utils.sendRequest(`http://localhost:3001/dev/alarms/${a.uuid}/activate/false`, 'PATCH')
                    .then(() => console.log('alarm', a.uuid, 'deactivated'))
                    .catch(e => console.error(e))
                }
              }
            })
          })
          .catch(e => console.error('Error:', e))
      })
      .catch(e => console.error('Error:', e))
  }
})