const db = require("../../models");
const config = require("../../config/auth.config");
const translation = require("../../other/languages");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
let templase = require('../../templaseResponse')

exports.signup = (req, res) => {
    // Save User to Database
    try {
        User.create({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            roleId:req.body.role===undefined ?1:req.body.role
        })
            .then(user => {
                if (user) {
                    templase(200, translation.language(req.headers.lang, "UserRegistered"),[],false, res)

                } else {
                    templase(500, "",[],false,res)
                }
            })
            .catch(err => {
                templase(500, err.message,[],false,res)
            });
    }catch (err) {
        templase(500, err.message,[],false,res)
    }

};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (!user) {
                return  templase(401, translation.language(req.headers.lang, "WrongLoginOrPwd"),[],true, res)
            }
            let active = user.dataValues.active;
            if (active === true) {
                var passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );

                if (!passwordIsValid) {
                    return  templase(401, translation.language(req.headers.lang, "WrongLoginOrPwd"),[],true, res)
                }

                var token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 86400 // 24 hours
                });
                delete user.dataValues.password
                templase(200,"",{
                    accessToken: token,
                    user
                },false,res)
            }
            else {
                templase(403, translation.language(req.headers.lang, "BlockedUser"), [], true, res)
            }
        })
        .catch(err => {
            templase(500, err.message ,[],false, res)
        });
};
