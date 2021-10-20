const db = require("../../models");
const templase = require("../../templaseResponse");
const translation = require("../../other/languages");
const Op = db.Sequelize.Op;
const Sensor_Statistics = db.sensor_statistics, Sensor = db.sensor;

exports.getObject = (req, res) => {
    try {
        let factoryId = req.body.factoryId
        let channel = req.body.channel
        let start_date = req.body.start_date
        let end_date = req.body.end_date
        Sensor_Statistics.findAll({where: {[Op.and]: {factory_ID: factoryId, channel: channel, createdAt: { [Op.between]: [start_date, end_date] }}}})
            .then(async objects => {
                if(objects.length === 0) templase(200, "", [], true, res)
                else {
                    templase(200, "", objects, true, res)
                }
            }).catch(err => {templase(500, err.message, [], true, res)})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectCreate = async (req, res) => {
    try {
        let {body} = req
        let oldSensorStat = await Sensor_Statistics.findOne({where: {[Op.and]: {factory_ID: body.factory_ID, channel: body.channel}}, createdAt: [db.Sequelize.fn('max', db.Sequelize.col('createdAt')), 'date'], limit: 1, order: [['createdAt', 'DESC']]})
        let bodyDate = new Date(body.createdAt)
        if(bodyDate > oldSensorStat.dataValues.createdAt) {
            Sensor.update(body, {where: {[Op.and]: {factory_ID: body.factory_ID, channel: body.channel}}})
        }
        Sensor_Statistics.create(body)
            .then(object => {
                if(!object) templase(501, translation.language(req.headers.lang, "ObjectNotRegistered"), [], true, res)
                templase(200, translation.language(req.headers.lang, "ObjectRegistered"), [], true, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectUpdate = async (req, res) => {
    try {
        let {id} = req.params
        let {body} = req
        await Sensor_Statistics.update(body, {where: {id: id}})
            .then((response) => {
                if(response[0]) templase(200, translation.language(req.headers.lang, "ObjectUpdated"), [], true, res)
                else templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
        let lastStat = await Sensor_Statistics.findOne({where: {[Op.and]: {factory_ID: body.factory_ID, channel: body.channel}}, limit: 1, order: [['id', 'DESC']]})
        if(Number(id) === lastStat.dataValues.id) {
            await Sensor.update({temperature: lastStat.dataValues.temperature, humidity: lastStat.dataValues.humidity}, {where: {[Op.and]: {factory_ID: lastStat.dataValues.factory_ID, channel: lastStat.dataValues.channel}}})
        }
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectDelete = (req, res) => {
    try {
        let {id} = req.params
        Sensor_Statistics.destroy({where: {id: id}})
            .then((response) => {
                if(response === 1) templase(200, translation.language(req.headers.lang, "ObjectDeleted"), [], true, res)
                else templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};
