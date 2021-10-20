const db = require("../../models");
const templase = require("../../templaseResponse");
const Op = db.Sequelize.Op;
const translation = require("../../other/languages");
const GDP_Check = db.gdp_check;

exports.getObject = (req, res) => {
    try {
        let {id} = req.params
        let company = req.headers.companyid
        if(!id) {
            GDP_Check.findAll({where: {companyId: company}})
                .then(async objects => {
                    if(objects.length === 0) templase(200, "", [], true, res)
                    else templase(200, "", objects, true, res)
                }).catch(err => {templase(500, err.message, [], true, res)})
        }
        else {
            GDP_Check.findOne({where: {[Op.and]: {id: id, companyId: company}}})
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
        GDP_Check.create(body)
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
        GDP_Check.update(body, {where: {id: id}})
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
        GDP_Check.destroy({where: {id: id}})
            .then((response) => {
                if(response === 1) templase(200, translation.language(req.headers.lang, "ObjectDeleted"), [], true, res)
                else templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};
