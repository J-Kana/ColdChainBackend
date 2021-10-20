var CronJob = require('cron').CronJob;
const WS = require('ws');
const db = require("../models");
const Op = db.Sequelize.Op;
const Sensor_Statistics = db.sensor_statistics, Sensor = db.sensor, Notification = db.notification, Object = db.object, Object_Statistics = db.object_statistics,
    Event = db.event, User = db.user, User_NT = db.user_notification_type, Notification_Type = db.notification_type, Firebase_Token = db.firebase_token;

let funcSensorArr = async () => {
    let sensorArr = []
    await Sensor.findAll({where: {type_device: "Sensor"}})
        .then(sensors => {
            if(sensors.length > 0) {
                for(let sensor of sensors) {
                    sensorArr.push(sensor)
                }
            }
        }).catch(err => { console.log("\n\t\t\t Sensor URL error - " + err)})

    let sendEventNotif = async (temperature, humidity, objectID, sensorID, companyID) => {
        let sensor = await Sensor.findOne({where: {id: sensorID}})
        if(temperature === 'e1' || humidity === 'e1') {
            let event = {
                title: "'e1' - неисправен чувствительный элемент датчика!",
                description: null,
                event_description: "Датчик " + sensor.dataValues.name + " - 'e1': неисправен чувствительный элемент датчика!",
                active: true,
                userId: null,
                sensorId: sensorID,
                objectID: null,
                companyId: companyID,
                body: "Датчик " + sensor.dataValues.name + " - 'e1': неисправен чувствительный элемент датчика!"
            }
            await Event.create(event)
            io.emit("eventData", event)
            try {
                let allUsers = await User.findAll({where: {companyId: companyID}, include: [{ model: Notification_Type, where: {id: 1}}]})
                let firebaseArr = []
                for(let each of allUsers) {
                    let firebaseToken = await Firebase_Token.findAll({where: {userId: each.dataValues.id}})
                    for(let token of firebaseToken) {
                        firebaseArr.push(token.dataValues.token)
                    }
                }
                sendFirebaseMessage(firebaseArr, event.title, "Датчик " + sensor.dataValues.name + " - 'e1': неисправен чувствительный элемент датчика!")
            }
            catch(e) { console.log(e) }
        }
        else if(temperature === 'e2' || humidity === 'e2') {
            let event = {
                title: "'e2' - нет связи с прибором!",
                description: null,
                event_description: "Датчик " + sensor.dataValues.name + " - 'e2': нет связи с прибором!",
                active: true,
                userId: null,
                sensorId: sensorID,
                objectID: null,
                companyId: companyID,
                body: "Датчик " + sensor.dataValues.name + " - 'e2': нет связи с прибором!"
            }
            await Event.create(event)
            io.emit("eventData", event)
            try {
                let allUsers = await User.findAll({where: {companyId: companyID}, include: [{ model: Notification_Type, where: {id: 1}}]})
                let firebaseArr = []
                for(let each of allUsers) {
                    let firebaseToken = await Firebase_Token.findAll({where: {userId: each.dataValues.id}})
                    for(let token of firebaseToken) {
                        firebaseArr.push(token.dataValues.token)
                    }
                }
                sendFirebaseMessage(firebaseArr, event.title, "Датчик " + sensor.dataValues.name + " - 'e2': нет связи с прибором!")
            }
            catch(e) { console.log(e) }
        }
        else if(temperature === 'e3' || humidity === 'e3') {
            let event = {
                title: "'e3' - датчик отключен из опроса!",
                description: null,
                event_description: "Датчик " + sensor.dataValues.name + " - 'e3': датчик отключен из опроса!",
                active: true,
                userId: null,
                sensorId: sensorID,
                objectID: null,
                companyId: companyID,
                body: "Датчик " + sensor.dataValues.name + " - 'e3': датчик отключен из опроса!"
            }
            await Event.create(event)
            io.emit("eventData", event)
            try {
                let allUsers = await User.findAll({where: {companyId: companyID}, include: [{ model: Notification_Type, where: {id: 1}}]})
                let firebaseArr = []
                for(let each of allUsers) {
                    let firebaseToken = await Firebase_Token.findAll({where: {userId: each.dataValues.id}})
                    for(let token of firebaseToken) {
                        firebaseArr.push(token.dataValues.token)
                    }
                }
                sendFirebaseMessage(firebaseArr, event.title, "Датчик " + sensor.dataValues.name + " - 'e3': датчик отключен из опроса!")
            }
            catch(e) { console.log(e) }
        }
        else if(temperature === 'e4' || humidity === 'e4') {
            let event = {
                title: "'e4' - данные не инициализированы!",
                description: null,
                event_description: "Датчик " + sensor.dataValues.name + " - 'e4': данные не инициализированы!",
                active: true,
                userId: null,
                sensorId: sensorID,
                objectID: null,
                companyId: companyID,
                body: "Датчик " + sensor.dataValues.name + " - 'e4': данные не инициализированы!"
            }
            await Event.create(event)
            io.emit("eventData", event)
            try {
                let allUsers = await User.findAll({where: {companyId: companyID}, include: [{ model: Notification_Type, where: {id: 1}}]})
                let firebaseArr = []
                for(let each of allUsers) {
                    let firebaseToken = await Firebase_Token.findAll({where: {userId: each.dataValues.id}})
                    for(let token of firebaseToken) {
                        firebaseArr.push(token.dataValues.token)
                    }
                }
                sendFirebaseMessage(firebaseArr, event.title, "Датчик " + sensor.dataValues.name + " - 'e4': данные не инициализированы!")
            }
            catch(e) { console.log(e) }
        }
        else if(temperature === 'e5' || humidity === 'e5') {
            let event = {
                title: "'e5' - ожидание первого обнаружения (при сканировании) прибора!",
                description: null,
                event_description: "Датчик " + sensor.dataValues.name + " - 'e5': ожидание первого обнаружения (при сканировании) прибора!",
                active: true,
                userId: null,
                sensorId: sensorID,
                objectID: null,
                companyId: companyID,
                body: "Датчик " + sensor.dataValues.name + " - 'e5': ожидание первого обнаружения (при сканировании) прибора!"
            }
            await Event.create(event)
            io.emit("eventData", event)
            try {
                let allUsers = await User.findAll({where: {companyId: companyID}, include: [{ model: Notification_Type, where: {id: 1}}]})
                let firebaseArr = []
                for(let each of allUsers) {
                    let firebaseToken = await Firebase_Token.findAll({where: {userId: each.dataValues.id}})
                    for(let token of firebaseToken) {
                        firebaseArr.push(token.dataValues.token)
                    }
                }
                sendFirebaseMessage(firebaseArr, event.title, "Датчик " + sensor.dataValues.name + " - 'e5': ожидание первого обнаружения (при сканировании) прибора!")
            }
            catch(e) { console.log(e) }
        }
        else {
            await Object.findOne({where: {id: objectID}})
                .then(async object => {
                    if(!!object) {
                        if(Number(temperature) > Number(object.max_temperature)) {
                            let event = {
                                title: "Превышенное пороговое значение температуры!",
                                description: null,
                                event_description: "Объект " + object.dataValues.name + " - превышено пороговое значение температуры!",
                                active: true,
                                userId: null,
                                sensorId: null,
                                objectId: objectID,
                                companyId: companyID,
                                body: "Объект " + object.dataValues.name + " - превышено пороговое значение температуры!"
                            }
                            await Event.create(event)
                            io.emit("eventData", event)
                            try {
                                let allUsers = await User.findAll({where: {companyId: companyID}, include: [{ model: Notification_Type, where: {id: 1}}]})
                                let firebaseArr = []
                                for(let each of allUsers) {
                                    let firebaseToken = await Firebase_Token.findAll({where: {userId: each.dataValues.id}})
                                    for(let token of firebaseToken) {
                                        firebaseArr.push(token.dataValues.token)
                                    }
                                }
                                sendFirebaseMessage(firebaseArr, event.title, "Объект " + object.dataValues.name + " - превышено пороговое значение температуры!")
                            }
                            catch(e) { console.log(e) }
                        }
                        if(Number(temperature) < Number(object.min_temperature)) {
                            let event = {
                                title: "Пониженное пороговое значение температуры!",
                                description: null,
                                event_description: "Объект " + object.dataValues.name + " - понижено пороговое значение температуры!",
                                active: true,
                                userId: null,
                                sensorId: null,
                                objectId: objectID,
                                companyId: companyID,
                                body: "Объект " + object.dataValues.name + " - понижено пороговое значение температуры!"
                            }
                            await Event.create(event)
                            io.emit("eventData", event)
                            try {
                                let allUsers = await User.findAll({where: {companyId: companyID}, include: [{ model: Notification_Type, where: {id: 1}}]})
                                let firebaseArr = []
                                for(let each of allUsers) {
                                    let firebaseToken = await Firebase_Token.findAll({where: {userId: each.dataValues.id}})
                                    for(let token of firebaseToken) {
                                        firebaseArr.push(token.dataValues.token)
                                    }
                                }
                                sendFirebaseMessage(firebaseArr, event.title, "Объект " + object.dataValues.name + " - понижено пороговое значение температуры!")
                            }
                            catch(e) { console.log(e) }
                        }
                        if(Number(humidity) > Number(object.max_humidity)) {
                            let event = {
                                title: "Превышенное пороговое значение влажности!",
                                description: null,
                                event_description: "Объект " + object.dataValues.name + " - превышено пороговое значение влажности!",
                                active: true,
                                userId: null,
                                sensorId: null,
                                objectId: objectID,
                                companyId: companyID,
                                body: "Объект " + object.dataValues.name + " - превышено пороговое значение влажности!"
                            }
                            await Event.create(event)
                            io.emit("eventData", event)
                            try {
                                let allUsers = await User.findAll({where: {companyId: companyID}, include: [{ model: Notification_Type, where: {id: 1}}]})
                                let firebaseArr = []
                                for(let each of allUsers) {
                                    let firebaseToken = await Firebase_Token.findAll({where: {userId: each.dataValues.id}})
                                    for(let token of firebaseToken) {
                                        firebaseArr.push(token.dataValues.token)
                                    }
                                }
                                sendFirebaseMessage(firebaseArr, event.title, "Объект " + object.dataValues.name + " - превышено пороговое значение влажности!")
                            }
                            catch(e) { console.log(e) }
                        }
                        if(Number(humidity) < Number(object.min_humidity)) {
                            let event = {
                                title: "Пониженное пороговое значение влажности!",
                                description: null,
                                event_description: "Объект " + object.dataValues.name + " - понижено пороговое значение влажности!",
                                active: true,
                                userId: null,
                                sensorId: null,
                                objectId: objectID,
                                companyId: companyID,
                                body: "Объект " + object.dataValues.name + " - понижено пороговое значение влажности!"
                            }
                            await Event.create(event)
                            io.emit("eventData", event)
                            try {
                                let allUsers = await User.findAll({where: {companyId: companyID}, include: [{ model: Notification_Type, where: {id: 1}}]})
                                let firebaseArr = []
                                for(let each of allUsers) {
                                    let firebaseToken = await Firebase_Token.findAll({where: {userId: each.dataValues.id}})
                                    for(let token of firebaseToken) {
                                        firebaseArr.push(token.dataValues.token)
                                    }
                                }
                                sendFirebaseMessage(firebaseArr, event.title, "Объект " + object.dataValues.name + " - понижено пороговое значение влажности!")
                            }
                            catch(e) { console.log(e) }
                        }
                    }
                })
        }
    }

    let sendEventNotifError = async (sensor) => {
        let event = {
            title: "Критическая ошибка - Сокет не отвечает!",
            description: null,
            event_description: "Датчик " + sensor.dataValues.name + " - Критическая ошибка: Сокет не отвечает!",
            active: true,
            userId: null,
            sensorId: sensor.dataValues.id,
            companyId: sensor.dataValues.companyId
        }
        await Event.create(event)
        io.emit("eventData", event)
        try {
            let allUsers = await User.findAll({where: {companyId: sensor.dataValues.companyId}, include: [{ model: Notification_Type, where: {id: 1}}]})
            let firebaseArr = []
            for(let each of allUsers) {
                let firebaseToken = await Firebase_Token.findAll({where: {userId: each.dataValues.id}})
                for(let token of firebaseToken) {
                    firebaseArr.push(token.dataValues.token)
                }
            }
            sendFirebaseMessage(firebaseArr, event.title, "Датчик " + sensor.dataValues.name + " - Критическая ошибка: Сокет не отвечает!")
        }
        catch(e) { console.log(e) }
    }

    let sendNotif = async (temperature, humidity, batteryLife, batteryCapacity, deviceSignal, modemSignal, deviceID, sensorID, companyID) => {
        if(temperature === 'e1' || humidity === 'e1' || batteryLife === 'e1' || batteryCapacity === 'e1' || deviceSignal === 'e1' || modemSignal === 'e1' || deviceID === 'e1') {
            let body = {
                title: "Ошибка датчика!",
                description: "'e1' - неисправен чувствительный элемент датчика",
                active: false,
                sensorId: sensorID,
                companyId: companyID
            }
            await Notification.create(body)
                .then(records => { console.log("\n\t\t Notification creation records: " + records) })
                .catch(err => { console.log("\n\t Notification table error - " + err) })
        }
        else if(temperature === 'e2' || humidity === 'e2' || batteryLife === 'e2' || batteryCapacity === 'e2' || deviceSignal === 'e2' || modemSignal === 'e2' || deviceID === 'e2') {
            let body = {
                title: "Ошибка датчика!",
                description: "'e2' - нет связи с прибором",
                active: false,
                sensorId: sensorID,
                companyId: companyID
            }
            await Notification.create(body)
                .then(records => { console.log("\n\t\t Notification creation records: " + records) })
                .catch(err => { console.log("\n\t Notification table error - " + err) })
        }
        else if(temperature === 'e3' || humidity === 'e3' || batteryLife === 'e3' || batteryCapacity === 'e3' || deviceSignal === 'e3' || modemSignal === 'e3' || deviceID === 'e3') {
            let body = {
                title: "Ошибка датчика!",
                description: "'e3' - датчик отключен из опроса",
                active: false,
                sensorId: sensorID,
                companyId: companyID
            }
            await Notification.create(body)
                .then(records => { console.log("\n\t\t Notification creation records: " + records) })
                .catch(err => { console.log("\n\t Notification table error - " + err) })
        }
        else if(temperature === 'e4' || humidity === 'e4' || batteryLife === 'e4' || batteryCapacity === 'e4' || deviceSignal === 'e4' || modemSignal === 'e4' || deviceID === 'e4') {
            let body = {
                title: "Ошибка датчика!",
                description: "'e4' - данные не инициализированы",
                active: false,
                sensorId: sensorID,
                companyId: companyID
            }
            await Notification.create(body)
                .then(records => { console.log("\n\t\t Notification creation records: " + records) })
                .catch(err => { console.log("\n\t Notification table error - " + err) })
        }
        else if(temperature === 'e5' || humidity === 'e5' || batteryLife === 'e5' || batteryCapacity === 'e5' || deviceSignal === 'e5' || modemSignal === 'e5' || deviceID === 'e5') {
            let body = {
                title: "Ошибка датчика!",
                description: "'e5' - ожидание первого обнаружения (при сканировании) прибора",
                active: false,
                sensorId: sensorID,
                companyId: companyID
            }
            await Notification.create(body)
                .then(records => { console.log("\n\t\t Notification creation records: " + records) })
                .catch(err => { console.log("\n\t Notification table error - " + err) })
        }
        else {
            let test = await Sensor.findOne({where: {id: sensorID}})
            console.log(test.name)
            let test2 = await Object.findOne({where: {id: test.dataValues.objectId}})
            console.log(test2.name)

            await Sensor.findOne({where: {id: sensorID}})
                .then(async sensor => {
                    await Object.findOne({where: {id: sensor.dataValues.objectId}})
                        .then(async object => {
                            if(!!object) {
                                let parentObj = await Object.findOne({where: {id: object.dataValues.object_ID}})
                                if(!!parentObj) {
                                    if(Number(temperature) > Number(object.max_temperature)) {
                                        let body = {
                                            title: "Превышение температуры!",
                                            description: object.name + " - " + parentObj.name + ". Превышенное пороговое значение температуры " + temperature + "°C",
                                            active: true,
                                            companyId: object.companyId,
                                            sensorId: sensor.dataValues.id
                                        }
                                        await Notification.create(body)
                                            .then(records => { console.log("\n\t\t Notification creation records: " + records) })
                                            .catch(err => { console.log("\n\t Notification table error - " + err) })
                                    }
                                    if(Number(temperature) < Number(object.min_temperature)) {
                                        let body = {
                                            title: "Понижение температуры!",
                                            description: object.name + " - " + parentObj.name + ". Пониженное пороговое значение температуры " + temperature + "°C",
                                            active: true,
                                            companyId: object.companyId,
                                            sensorId: sensor.dataValues.id
                                        }
                                        await Notification.create(body)
                                            .then(records => { console.log("\n\t\t Notification creation records: " + records) })
                                            .catch(err => { console.log("\n\t Notification table error - " + err) })
                                    }
                                    if(Number(humidity) > Number(object.max_humidity)) {
                                        let body = {
                                            title: "Превышение влажности!",
                                            description: object.name + " - " + parentObj.name + ". Превышенное пороговое значение влажности " + humidity + "%",
                                            active: true,
                                            companyId: object.companyId,
                                            sensorId: sensor.dataValues.id
                                        }
                                        await Notification.create(body)
                                            .then(records => { console.log("\n\t\t Notification creation records: " + records) })
                                            .catch(err => { console.log("\n\t Notification table error - " + err) })
                                    }
                                    if(Number(humidity) < Number(object.min_humidity)) {
                                        let body = {
                                            title: "Понижение влажности!",
                                            description: object.name + " - " + parentObj.name + ". Пониженное пороговое значение влажности " + humidity + "%",
                                            active: true,
                                            companyId: object.companyId,
                                            sensorId: sensor.dataValues.id
                                        }
                                        await Notification.create(body)
                                            .then(records => { console.log("\n\t\t Notification creation records: " + records) })
                                            .catch(err => { console.log("\n\t Notification table error - " + err) })
                                    }
                                }
                                else {
                                    if(Number(temperature) > Number(object.max_temperature)) {
                                        let body = {
                                            title: "Превышение температуры!",
                                            description: object.name + ". Превышенное пороговое значение температуры " + temperature + "°C",
                                            active: true,
                                            companyId: object.companyId,
                                            sensorId: sensor.dataValues.id
                                        }
                                        await Notification.create(body)
                                            .then(records => { console.log("\n\t\t Notification creation records: " + records) })
                                            .catch(err => { console.log("\n\t Notification table error - " + err) })
                                    }
                                    if(Number(temperature) < Number(object.min_temperature)) {
                                        let body = {
                                            title: "Понижение температуры!",
                                            description: object.name + ". Пониженное пороговое значение температуры " + temperature + "°C",
                                            active: true,
                                            companyId: object.companyId,
                                            sensorId: sensor.dataValues.id
                                        }
                                        await Notification.create(body)
                                            .then(records => { console.log("\n\t\t Notification creation records: " + records) })
                                            .catch(err => { console.log("\n\t Notification table error - " + err) })
                                    }
                                    if(Number(humidity) > Number(object.max_humidity)) {
                                        let body = {
                                            title: "Превышение влажности!",
                                            description: object.name + ". Превышенное пороговое значение влажности " + humidity + "%",
                                            active: true,
                                            companyId: object.companyId,
                                            sensorId: sensor.dataValues.id
                                        }
                                        await Notification.create(body)
                                            .then(records => { console.log("\n\t\t Notification creation records: " + records) })
                                            .catch(err => { console.log("\n\t Notification table error - " + err) })
                                    }
                                    if(Number(humidity) < Number(object.min_humidity)) {
                                        let body = {
                                            title: "Понижение влажности!",
                                            description: object.name + ". Пониженное пороговое значение влажности " + humidity + "%",
                                            active: true,
                                            companyId: object.companyId,
                                            sensorId: sensor.dataValues.id
                                        }
                                        await Notification.create(body)
                                            .then(records => { console.log("\n\t\t Notification creation records: " + records) })
                                            .catch(err => { console.log("\n\t Notification table error - " + err) })
                                    }
                                }
                            }
                        })
                })
                .catch(err => { console.log("\n\t Sensor table error - " + err) })
        }
    };

    let sendNotifError = async (sensor) => {
        let body = {
            title: "Критическая ошибка!",
            description: "Сокет не отвечает!",
            active: false,
            sensorId: null,
            companyId: null
        }
        await Notification.create(body).catch(err => { console.log("Notification table error - " + err) })
        let event = {
            title: "Критическая ошибка - Сокет не отвечает!",
            description: null,
            event_description: "Датчик " + sensor.dataValues.name + " - Критическая ошибка: Сокет не отвечает!",
            active: true,
            userId: null,
            sensorId: sensor.dataValues.id,
            companyId: null
        }
        await Event.create(event)
    };

    let senserSend = async (step) => {
        let sensorObjectArr = []

        for(let sensor of sensorArr) {
            let WebSocket = new WS(sensor.dataValues.modem_url, 'tera-command-protocol'); // ws://f2bb3bdb6b10153b73f9.tera.pp.ua:7681
            let sensorIDs = []
            console.log("WebSocket Server start")

            WebSocket.onerror = function () {
                console.log('\n WebSocket connection error!');
                if(step < 5) {
                    sendNotifError(sensor)
                    step++
                    senserSend(step)
                }
            };

            await WebSocket.on('open', async function open() {
                // WebSocket.send('something');
                console.log('\n WebSocket connected!');
                let data = []
                sensorIDs.push(sensor.dataValues)
                data.push({ devaddr: sensor.dataValues.channel, params: sensor.dataValues.parameter.split(',') })
                if(WebSocket.readyState === WebSocket.OPEN) {
                    let json = { "version": "0", "req": [{ "cmd": "getvalues", "service": "scom", "proto": "tbus", "data": data }] }
                    console.log(JSON.stringify(json))
                    WebSocket.send(JSON.stringify(json))
                }
            });

            await WebSocket.on('message', async function incoming(body) {
                if(typeof body === 'string') {
                    let json = JSON.parse(body)
                    if(json.resp.length === 0) {
                        sensorArr = sensorArr.filter(el => el.id !== sensor.dataValues.id)
                        sendEventNotifError(sensor)
                    }
                    let data = json.resp[0].data

                    for(let element of data) {
                        let batteryLife = null, batteryCapacity = null, deviceSignal = null, modemSignal = null, deviceID = null
                        let channel = element.devaddr
                        let temperature = element.params[0].val
                        let humidity = element.params[1].val
                        if(!!element.params[2])  deviceID = element.params[2].val
                        if(!!element.params[3])  batteryLife = element.params[3].val
                        if(!!element.params[4])  batteryCapacity = element.params[4].val
                        if(!!element.params[5])  deviceSignal = element.params[5].val
                        if(!!element.params[6])  modemSignal = element.params[6].val
                        let sensorData = sensorIDs.find(el => el.channel === channel)
                        sensorObjectArr.push({
                            id: sensor.dataValues.id,
                            temperature,
                            humidity,
                            objectId: sensor.dataValues.objectId,
                            companyId: sensor.dataValues.companyId
                        })
                        // Ждем пока соберется масив данных чтобы потом записать его в объекты
                        if(sensorObjectArr.length === sensorArr.length ) {
                            writeAverageTemperatureAndHumidityInObject(sensorObjectArr)
                        }
                        await sendNotif(temperature, humidity, batteryLife, batteryCapacity, deviceSignal, modemSignal, deviceID, sensorData.id, sensor.dataValues.companyId);
                        let StatBody = {
                            channel: channel,
                            temperature: temperature,
                            humidity: humidity,
                            factory_ID: deviceID,
                            bat_lifetime: batteryLife,
                            bat_capacity: batteryCapacity,
                            device_signal: deviceSignal,
                            modem_signal: modemSignal
                        }
                        await Sensor_Statistics.create(StatBody)
                            .then(objects => { io.emit("sensorData",StatBody); console.log("\n\t\tSensor Statistics objects: " + objects); WebSocket.close() })
                            .catch(err => { console.log("\n\t\tSensor Statistics creation error - " + err) })
                        // let oldSensorStat = await Sensor_Statistics.findOne({where: {[Op.and]: {factory_ID: sensor.dataValues.factory_ID, channel: sensor.dataValues.channel}}, createdAt: [db.Sequelize.fn('max', db.Sequelize.col('createdAt')), 'date'], limit: 1, order: [['createdAt', 'DESC']]})
                        let oldSensorStat = await Sensor_Statistics.findOne({where: {[Op.and]: {factory_ID: sensor.dataValues.factory_ID, channel: sensor.dataValues.channel}}, limit: 1, order: [['id', 'DESC']]})
                        if((sensor.dataValues.createdAt < oldSensorStat.dataValues.createdAt) && (sensor.dataValues.createdAt = oldSensorStat.dataValues.createdAt)) {
                            await Sensor.update({temperature: temperature, humidity: humidity, bat_lifetime: batteryLife, bat_capacity: batteryCapacity,
                                device_signal: deviceSignal, modem_signal: modemSignal, factory_ID: deviceID}, {where: {id: sensorData.id}})
                                .then(async records => {
                                    console.log("\n\t\t Sensor records: " + records);
                                    // await sendNotif(temperature, humidity, batteryLife, batteryCapacity, deviceSignal, modemSignal, deviceID, sensorData.id, sensor.dataValues.companyId);
                                    // let body = {
                                    //     channel: channel,
                                    //     temperature: temperature,
                                    //     humidity: humidity,
                                    //     factory_ID: deviceID,
                                    //     bat_lifetime: batteryLife,
                                    //     bat_capacity: batteryCapacity,
                                    //     device_signal: deviceSignal,
                                    //     modem_signal: modemSignal
                                    // }
                                    // await Sensor_Statistics.create(body)
                                    //     .then(objects => { console.log("\n\t\tSensor Statistics objects: " + objects); WebSocket.close() })
                                    //     .catch(err => { console.log("\n\t\tSensor Statistics creation error - " + err) })
                                })
                                .catch(err => { console.log("\n\t Sensor update error - " + err) });
                        }
                    }
                }
            });

            await WebSocket.on('close', function() {
                console.log('\n WebSocket closed!');
            });
        }

    }

    await senserSend(0)
// функция для нахождения и записи средней темпиратуры и вллажности
    let writeAverageTemperatureAndHumidityInObject = async (sensorObjectArr) => {
        // ищем дубликаты и не дубликаты
        const sensorArrayWithoutDuplicates = [...new Set(sensorObjectArr.map(el => el.objectId))]
        let duplicates = [...sensorObjectArr.map(el => el.objectId)]
        let noDuplicates = [...sensorObjectArr.map(el => el.objectId)]
        noDuplicates = noDuplicates.filter((item,index) => {
            noDuplicates.splice(index, 1)
            const unique = !noDuplicates.includes(item)
            noDuplicates.splice(index, 0, item)
            return unique;
        })

        sensorArrayWithoutDuplicates.forEach((item) => {
            const i = duplicates.indexOf(item)
            duplicates = duplicates
                .slice(0, i)
                .concat(duplicates.slice(i + 1, duplicates.length))
        })
        // тут сначала записываем данные в объект у которого один датчик
        for(let val of noDuplicates) {
            let sensorFind = sensorObjectArr.find(el => el.objectId === val)
            if(sensorFind !== undefined) {
                // обновление одного объекта
                let res = await Object.update({temperature: sensorFind.temperature, humidity: sensorFind.humidity}, {where: {id: val}})
                sendEventNotif(sensorFind.temperature, sensorFind.humidity, val, sensorFind.id, sensorFind.companyId)
                if(!!res) {
                    // сбор статистики по объекту
                    let body = {
                        temperature: sensorFind.temperature,
                        humidity: sensorFind.humidity,
                        objectId:val
                    }
                    await Object_Statistics.create(body)
                }
            }
        }
        // где то тут можно прописать логику событий
        // находим и сохранняем  средние данные по датчикам в объекты
        for(let val of duplicates) {
            let sensorsFilter = sensorObjectArr.filter(el=>el.objectId === val)
            if(sensorsFilter.length>0) {
                let temperature = sensorsFilter.reduce((a, b) => ( Number(a.temperature) + Number(b.temperature))) / sensorsFilter.length;
                let humidity = sensorsFilter.reduce((a, b) => ( Number(a.humidity) + Number(b.humidity))) / sensorsFilter.length;
                // обновление одного объекта
                let res = await Object.update({temperature: temperature, humidity: humidity}, {where: {id: val}})
                sendEventNotif(temperature, humidity, val, sensorsFilter.id, sensorsFilter.companyId)
                if(!!res) {
                    // сбор статистики по объекту
                    let body = {
                        temperature: temperature,
                        humidity: humidity,
                        objectId:val
                    }
                    await Object_Statistics.create(body)
                }
            }
        }
    }

    function sendFirebaseMessage(firebaseTokenArr, title, body) {
        let topic = Math.random().toString(36).slice(2)
        let message = {
            notification: {
                title: title,
                body: body
            },
            webpush: {
                notification: {
                    requireInteraction: true,
                    icon: './logo.jpg',
                    click_action: `http://cooler.winext.kz/`
                },
                fcm_options: {
                    link: `http://cooler.winext.kz/`
                }
            },
            data: {
                score: '850',
                time: '2:45'
            },
            topic: topic
        };
        admin.messaging().subscribeToTopic(firebaseTokenArr, topic)
            .then(function(response) {
                // See the MessagingTopicManagementResponse reference documentation
                // for the contents of response.
                console.log('Successfully subscribed to topic:', response);
                admin.messaging().send(message)
                    .then((response) => {
                        // Response is a message ID string.
                        console.log('Successfully sent message:', response);
                        admin.messaging().unsubscribeFromTopic(firebaseTokenArr,topic).then(response => {
                            console.log("Successfully unsubscribeFromTopic", response)
                        }).catch(err => { console.log(err) })
                    })
                    .catch((error) => { console.log('Error sending message:', error); });
            })
            .catch(function(error) { console.log('Error subscribing to topic:', error); });
    }
}

// ОБЕРНУТЬ В ТАСК НА КАЖДЫЙ ЧАС
var WebSocketjob = new CronJob( '* * * * *', async function() {
    funcSensorArr();
}, null, true);

module.exports = WebSocketjob