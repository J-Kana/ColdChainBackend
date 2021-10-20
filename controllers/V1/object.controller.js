const db = require("../../models");
const templase = require("../../templaseResponse");
const Op = db.Sequelize.Op;
const translation = require("../../other/languages");
const Object = db.object, Company = db.company, ObjectType = db.object_type, TransportGeo = db.transport_geolocation, Sensor = db.sensor;

// var jwt = require("jsonwebtoken");
// const config = require("../../config/auth.config");
// var token = jwt.sign({ id: 1 }, config.secret, {
//     expiresIn: 86400 // 24 hours
// });
// console.log(token);

exports.getObject = (req, res) => {
    try {
        let {id} = req.params
        let company = req.headers.companyid
        if(!id) {
            Object.findAll({where: {companyId: company}, order: [['id', 'DESC']]})
                .then(async objects => {
                    if(objects.length === 0) templase(200, "", [], true, res)
                    else {
                        let objectArr = []
                        for(let obj of objects) {
                            obj.dataValues.companyId = await Company.findOne({where: {id: obj.dataValues.companyId}})
                            obj.dataValues.objectTypeId = await ObjectType.findOne({where: {id: obj.dataValues.objectTypeId}})
                            if(obj.dataValues.objectTypeId.id === 1) {
                                obj.dataValues.transport_geolocation = await TransportGeo.findAll({where: {objectId: obj.dataValues.id}})
                            }
                            objectArr.push(obj)
                        }
                        templase(200, "", objectArr, true, res)
                    }
                }).catch(err => {templase(500, err.message, [], true, res)})
        }
        else {
            Object.findOne({where: {[Op.and]: {id: id, companyId: company}}})
                .then(async object => {
                    if(!object) templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
                    try {
                        object.dataValues.companyId = await Company.findOne({where: {id: object.dataValues.companyId}})
                        object.dataValues.objectTypeId = await ObjectType.findOne({where: {id: object.dataValues.objectTypeId}})
                        if(object.dataValues.objectTypeId.id === 1) {
                            object.dataValues.transport_geolocation = await TransportGeo.findAll({where: {objectId: object.dataValues.id}})
                        }
                        templase(200, "", object, true ,res)
                    }
                    catch(e) { templase(500, e.message, [], true, res) }
                }).catch(err => {templase(500, err.message, [], true, res)})
        }
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.getTree = (req, res) => {
    try {
        let {id} = req.params
        let company = req.headers.companyid
        if(!id) {
            Object.findAll({where: {[Op.and]: {companyId: company}}})
                .then(async objects => {
                    if(objects.length === 0) templase(200, "", [], true, res)
                    else {
                        let objectArr = []
                        for(let obj of objects) {
                            obj.dataValues.companyId = await Company.findOne({where: {id: obj.dataValues.companyId}})
                            obj.dataValues.objectTypeId = await ObjectType.findOne({where: {id: obj.dataValues.objectTypeId}})
                            if(obj.dataValues.objectTypeId.id === 1) {
                                obj.dataValues.transport_geolocation = await TransportGeo.findAll({where: {objectId: obj.dataValues.id}})
                            }
                            obj.dataValues.sensorId = await Sensor.findAll({where: {objectId: obj.dataValues.id}})
                            objectArr.push(obj)
                        }
                        let result = []
                        let filterNullObjectId = objectArr.filter(el => el.object_ID === null)

                        if(filterNullObjectId !== undefined) {
                            for (let val of filterNullObjectId) {
                                result.push(getNextObj(val,objectArr))
                            }
                        }
                        templase(200, "", result, true, res)
                    }
                }).catch(err => {templase(500, err.message, [], true, res)})
        }
        else {
            // тут поиск не по id, так как лучше получить все объекты компании, чем потом искать кажый объект отдельно
            Object.findAll({where: {[Op.and]: {companyId: company}}})
                .then(async objects => {
                    if(objects.length === 0){
                        templase(200, "", [], true, res)
                        return false
                    }
                    // находим начальную точку
                    let object = objects.find(el => el.dataValues.id === Number(id))
                    if(object === undefined){
                        templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
                        return false
                    }
                    try {
                        let objectArr =[]
                        let result = []
                        // собираем все зависимости
                        for(let obj of objects) {
                            obj.dataValues.companyId = await Company.findOne({where: {id: obj.dataValues.companyId}})
                            obj.dataValues.objectTypeId = await ObjectType.findOne({where: {id: obj.dataValues.objectTypeId}})
                            if(obj.dataValues.objectTypeId.id === 1) {
                                obj.dataValues.transport_geolocation = await TransportGeo.findAll({where: {objectId: obj.dataValues.id}})
                            }
                            obj.dataValues.sensorId = await Sensor.findAll({where: {objectId: obj.dataValues.id}})
                            objectArr.push(obj)
                        }
                        result.push(getNextObj(object,objectArr))
                        templase(200, "", result, true ,res)
                    }
                    catch(e) { templase(500, e.message, [], true, res) }
                }).catch(err => {templase(500, err.message, [], true, res)})
        }

        // Функция собирает дерево объектов
        function getNextObj(obj, arrFullObject) {
            let filter = arrFullObject.filter(el => obj.id === el.object_ID)
            if(!!filter) {
                obj.dataValues.nextObject = filter
                for(let val of filter) {
                    getNextObj(val,arrFullObject)
                }
                return obj
            } else {
                obj.dataValues.nextObject = []
                return obj
            }
        }
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectCreate = (req, res) => {
    try {
        let {body} = req
        Object.create(body)
            .then(object => {
                if(!object) templase(501, translation.language(req.headers.lang, "ObjectNotRegistered"), [], true, res)
                templase(200, translation.language(req.headers.lang, "ObjectRegistered"), object, true, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectUpdate = (req, res) => {
    try {
        let {id} = req.params
        let {body} = req
        Object.update(body, {where: {id: id}})
            .then((response) => {
                if(response[0]) templase(200, translation.language(req.headers.lang, "ObjectUpdated"), [], true, res)
                else templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectDelete = async (req, res) => {
    try {
        let {id} = req.params
        Object.destroy({where: {id: id}})
            .then((response) => {
                if(response === 1) templase(200, translation.language(req.headers.lang, "ObjectDeleted"), [], true, res)
                else templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
        // await Placement.destroy({where: {objectId: null}})
        // await Refrigerator.destroy({where: {placementId: null}})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};
