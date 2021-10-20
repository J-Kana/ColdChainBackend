var CronJob = require('cron').CronJob;
const db = require("../models");
const Op = db.Sequelize.Op;
const Sensor = db.sensor, Object = db.object, Event = db.event;

var job = new CronJob( '*/5 * * * *', async function() {

    Event.findAll({where: {[Op.and]: {active: true, [Op.notNull]: [objectId]}}})
        .then(async events => {
            if(events.length > 0) {
                for(let event of events) {
                    let obj = await Object.findOne({where: {id: event.dataValues.objectId}})
                    if(obj.dataValues.temperature < obj.dataValues.max_temperature) {
                        await Event.update({active: false, description: "System"}, {where: {id: event.dataValues.id}})
                    }
                    else if(obj.dataValues.temperature > obj.dataValues.min_temperature) {
                        await Event.update({active: false, description: "System"}, {where: {id: event.dataValues.id}})
                    }
                    else if(obj.dataValues.humidity < obj.dataValues.max_humidity) {
                        await Event.update({active: false, description: "System"}, {where: {id: event.dataValues.id}})
                    }
                    else if(obj.dataValues.humidity > obj.dataValues.min_humidity) {
                        await Event.update({active: false, description: "System"}, {where: {id: event.dataValues.id}})
                    }
                }
            }
        })
}, null, true);

module.exports = job