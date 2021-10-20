const db = require("../models");
const template = require("../templaseResponse");
const translation = require("../other/languages");
const User = db.user;
const Company = db.company;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user) {
            template(409, translation.language(req.headers.lang, "ExistedUsername"),[],true, res)
            return;
        }
        // Email
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if (user) {
                template(409, translation.language(req.headers.lang, "ExistedEmail"),[],true, res)
                return;
            }
            next();
        });
    });
};

checkDuplicateCompanyUsernameAndEmail = (req, res, next) => {
    Company.findOne({
        where: {
            email: req.body.email
        }
    }).then(obj => {
        if (obj) {
            template(409, translation.language(req.headers.lang, "ExistedEmail"),[],true, res)
            return;
        }
        next();
    });
};

// checkRolesExisted = (req, res, next) => {
//     if (req.body.roles) {
//         for (let i = 0; i < req.body.roles.length; i++) {
//             if (!ROLES.includes(req.body.roles[i])) {
//                 template(400, "Failed! Role does not exist = " + req.body.roles[i],[],false, res)
//                 return;
//             }
//         }
//     }
//     next();
// };

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkDuplicateCompanyUsernameAndEmail: checkDuplicateCompanyUsernameAndEmail
    // checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
