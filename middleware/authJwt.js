const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const translation = require("../other/languages");
const User = db.user, Role = db.role, Token = db.token, Company = db.company;
const  tamplate = require('../templaseResponse');

verifyToken = async (req, res, next) => {
    let token = req.headers["x-access-token"];
    let BlacklistTokens = await Token.findAll({where: {token: token}});

    if(BlacklistTokens.length > 0) {
        return tamplate(401, translation.language(req.headers.lang, "InvalidToken"),[],false, res)
    }
    else {
        if(!token) {
            return tamplate(401, translation.language(req.headers.lang, "TokenNotProvided"),[],false, res)
        }
        jwt.verify(token, config.secret, (err, decoded) => {
            if(err) {
                return tamplate(401, translation.language(req.headers.lang, "Unauthorised"),[],false, res)
            }
            req.userId = decoded.id;
            next();
        });
    }
};

isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        Role.findByPk(user.roleId).then(role => {
            if(role.value === "Administrator") {
                next();
                return;
            }
            tamplate(403, translation.language(req.headers.lang, "ReqAdminRole"),[],true, res)
        }).catch(error => { tamplate(500, error.message,[],true, res) });
    });
};

isSuperAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        Role.findByPk(user.roleId).then(role => {
            if(role.value === "Super administrator") {
                next();
                return;
            }
            tamplate(403, translation.language(req.headers.lang, "ReqSuperAdminRole"),[],true, res)
        }).catch(error => { tamplate(500, error.message,[],true, res) });
    });
};

isSuperAdminOrAdmin = (req, res, next) => {
    try{
        User.findByPk(req.userId).then(user => {
            Role.findByPk(user.roleId).then(role => {
                if(role.value === "Super administrator") {
                    next();
                    return;
                }
                if(role.value === "Administrator") {
                    next();
                    return;
                }
                tamplate(403, translation.language(req.headers.lang, "ReqSuperAdminRole"),[],true, res)
            }).catch(error => { tamplate(500, error.message,[],true, res) });
        });
    }
    catch (e){ console.log(e) }
};

checkUserCompany = (req, res, next) => {
    try {
        let companyID = req.headers.companyid
        User.findByPk(req.userId).then(user => {
            Role.findByPk(user.roleId).then(role => {
                if(role.value === "Administrator") {
                    if(user.companyId === Number(companyID)) {
                        next();
                    } else {
                        tamplate(403, translation.language(req.headers.lang, "ReqAdminRole"),[],true, res)
                    }
                }
                else if(role.value === "Super administrator") {
                    next();
                }
                else {
                    tamplate(403, translation.language(req.headers.lang, "ReqAdminRole"),[],true, res)
                }
            }).catch(error => { tamplate(500, error.message,[],true, res) });
        });
    }
    catch(e) { console.log(e) }
}

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isSuperAdmin: isSuperAdmin,
    isSuperAdminOrAdmin: isSuperAdminOrAdmin,
    checkUserCompany: checkUserCompany
};
module.exports = authJwt;
