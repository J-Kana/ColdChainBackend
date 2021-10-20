const db = require("../../models");
const templase = require("../../templaseResponse");
const translation = require("../../other/languages");
const FirebaseToken = db.firebase_token;

exports.objectCreate = (req, res) => {
    try {
        let {body} = req
        FirebaseToken.create(body)
            .then(object => {
                if(!object) templase(501, translation.language(req.headers.lang, "ObjectNotRegistered"), [], true, res)
                templase(200, translation.language(req.headers.lang, "ObjectRegistered"), object, true, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};
