const db = require("../../models");
const templase = require("../../templaseResponse");
const translation = require("../../other/languages");
const Op = db.Sequelize.Op;
const Object_Statistics = db.object_statistics, Object = db.object;

exports.getObject = (req, res) => {
    try {
        let objectId = req.body.objectId
        let start_date = req.body.start_date
        let end_date = req.body.end_date
        Object_Statistics.findAll({where: {[Op.and]: {objectId: objectId, createdAt: { [Op.between]: [start_date, end_date] }}}})
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
        let oldObjectStat = await Object_Statistics.findOne({where: {objectId: body.objectId}, createdAt: [db.Sequelize.fn('max', db.Sequelize.col('createdAt')), 'date'], limit: 1, order: [['createdAt', 'DESC']]})
        let bodyDate = new Date(body.createdAt)
        if(bodyDate > oldObjectStat.dataValues.createdAt) {
            Object.update(body, {where: {id: body.objectId}})
        }
        Object_Statistics.create(body)
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
        Object_Statistics.update(body, {where: {id: id}})
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
        Object_Statistics.destroy({where: {id: id}})
            .then((response) => {
                if(response === 1) templase(200, translation.language(req.headers.lang, "ObjectDeleted"), [], true, res)
                else templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};
