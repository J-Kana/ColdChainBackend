const db = require("../../../models");
const templase = require('../../../templaseResponse');
const translation = require("../../../other/languages");
const NotificationType = db.notification_type;

exports.getObject = (req, res) => {
    try {
        let {id} = req.params
        if(!id) {
            NotificationType.findAll()
                .then(async objects => {
                    if(objects.length === 0) templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
                    else templase(200, "", objects, true, res)
                }).catch(err => {templase(500, err.message, [], true, res)})
        }
        else {
            NotificationType.findByPk(id)
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
        NotificationType.create(body)
            .then(object=>{
                if (!object)templase(501, translation.language(req.headers.lang, "ObjectNotRegistered"),[],true, res)
                templase(200, translation.language(req.headers.lang, "ObjectRegistered"),[],true, res)
            }).catch(err => {templase(500, err.message,[],true, res)});
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectUpdate = (req, res) => {
    try {
        let {id} = req.params
        let {body} = req
        NotificationType.update(body, {where: {id: id}})
            .then((response) => {
                if (response[0]) templase(200, translation.language(req.headers.lang, "ObjectUpdated"),[],true, res)
                else templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
            }).catch(err => {templase(500, err.message,[],true, res)});
    }
    catch(e){ templase(500, e.message, [], true, res) }
};

exports.objectDelete = (req, res) => {
    try{
        let {id} = req.params
        NotificationType.destroy({where: {id: id}})
            .then((response) => {
                if (response === 1) templase(200, translation.language(req.headers.lang, "ObjectDeleted"),[],true, res)
                else templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
            }).catch(err => {templase(500, err.message,[],true, res)});
    }
    catch(e) { templase(500, e.message, [], true, res) }
};
