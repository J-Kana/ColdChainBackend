const db = require("../../models");
const templase = require("../../templaseResponse");
const Op = db.Sequelize.Op;
const translation = require("../../other/languages");
const Event = db.event, User = db.user;

exports.getObject = (req, res) => {
    try {
        let {id} = req.params
        let company = req.headers.companyid
        let active = req.body.active
        let page = req.body.page
        let offset = req.body.offset
        if(!id) {
            Event.findAndCountAll({where: {companyId: company, active: active}, order: [['id', 'DESC']], offset: offset, limit: page})
                .then(async objects => {
                    if(objects.length === 0) templase(200, "", [], true, res)
                    else {
                        let objectArr = []
                        for(let object of objects.rows) {
                            object.dataValues.userId = await User.findOne({where: {id: object.dataValues.userId}})
                            objectArr.push(object)
                        }
                        objects.rows = objectArr
                        templase(200, "", objects, true, res)
                    }
                }).catch(err => {templase(500, err.message, [], true, res)})
        }
        else {
            Event.findOne({where: {[Op.and]: {id: id, companyId: company}}})
                .then(async object => {
                    if(!object) templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
                    try { templase(200, "", object, true ,res) }
                    catch(e) { templase(500, e.message, [], true, res) }
                }).catch(err => {templase(500, err.message, [], true, res)})
        }
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectCreate = (req, res) => {
    try {
        let {body} = req
        Event.create(body)
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
        Event.update(body, {where: {id: id}})
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
        Event.destroy({where: {id: id}})
            .then((response) => {
                if(response === 1) templase(200, translation.language(req.headers.lang, "ObjectDeleted"), [], true, res)
                else templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};
