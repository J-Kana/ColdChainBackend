const db = require("../../models");
const templase = require("../../templaseResponse");
const Op = db.Sequelize.Op;
const translation = require("../../other/languages");
const Sensor = db.sensor, Company = db.company, Object = db.object;

exports.getObject = (req, res) => {
    try {
        let {id} = req.params
        let company = req.headers.companyid
        if(!id) {
            Sensor.findAll({where: {companyId: company}, order: [['id', 'DESC']]})
                .then(async objects => {
                    if(objects.length === 0) templase(200, "", [], true, res)
                    else {
                        let objectArr = []
                        for(let obj of objects) {
                            obj.dataValues.companyId = await Company.findOne({where: {id: obj.dataValues.companyId}})
                            obj.dataValues.objectId = await Object.findOne({where: {id: obj.dataValues.objectId}})
                            objectArr.push(obj)
                        }
                        templase(200, "", objectArr, true, res)
                    }
                }).catch(err => {templase(500, err.message, [], true, res)})
        }
        else {
            Sensor.findOne({where: {[Op.and]: {id: id, companyId: company}}})
                .then(async object => {
                    if(!object) templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
                    try {
                        object.dataValues.companyId = await Company.findOne({where: {id: object.dataValues.companyId}})
                        object.dataValues.objectId = await Object.findOne({where: {id: object.dataValues.objectId}})
                        templase(200, "", object, true ,res)
                    }
                    catch(e) { templase(500, e.message, [], true, res) }
                }).catch(err => {templase(500, err.message, [], true, res)})
        }
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectCreate = (req, res) => {
    try {
        let {body} = req
        Sensor.create(body)
            .then(object => {
                if(!object) templase(501, translation.language(req.headers.lang, "ObjectNotRegistered"), [], true, res)
                templase(200, translation.language(req.headers.lang, "ObjectRegistered"), [], true, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectUpdate = (req, res) => {
    try {
        let {id} = req.params
        let {body} = req
        Sensor.update(body, {where: {id: id}})
            .then((response) => {
                if(response[0]) templase(200, translation.language(req.headers.lang, "ObjectUpdated"), [], true, res)
                else templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectDelete = (req, res) => {
    try {
        let {id} = req.params
        Sensor.destroy({where: {id: id}})
            .then((response) => {
                if(response === 1) templase(200, translation.language(req.headers.lang, "ObjectDeleted"), [], true, res)
                else templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};
