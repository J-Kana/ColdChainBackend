/******************************************************************************************************************************/
/*                                                                                                                            */
/*                                               I STOPPED HERE                                                               */
/*                                                                                                                            */
/******************************************************************************************************************************/
const db = require("../../models");
const config = require("../../config/auth.config");
const templase = require("../../templaseResponse");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const Op = db.Sequelize.Op;
const nodemailer = require('nodemailer');
const translation = require("../../other/languages");
const User = db.user, Token = db.token, Role = db.role, Company = db.company, NotificationType = db.notification_type, User_NT = db.user_notification_type, fbt=db.firebase_token;

exports.getObject = (req, res) => {
    try {
        let {id} = req.params
        let company = req.headers.companyid
        if(!id){
            User.findAll({where: {companyId: company}, order: [['id', 'DESC']]})
                .then(async users => {
                    if(users.length === 0) templase(200, "", [], true, res)
                    else {
                        let userArr = []
                        for(let user of users) {
                            try {
                                delete user.dataValues.password
                                user.dataValues.roleId = await Role.findByPk(user.dataValues.roleId)
                                user.dataValues.companyId = await Company.findByPk(user.dataValues.companyId)
                                user.dataValues.notificationTypeId = await user.getNotification_types()
                                userArr.push(user.dataValues)
                            }
                            catch(e) { templase(500, e.message, [], true, res) }
                        }
                        templase(200, "", userArr, true, res)
                    }
                })
                .catch(err => templase(500, err.message, [], true, res));
        }
        else {
            User.findOne({where: {[Op.and]: {id: id, companyId: company}}})
                .then(async user => {
                    if(!user) templase(404, translation.language(req.headers.lang, "UserNotFound"), [], true, res)
                    try {
                        delete user.dataValues.password
                        user.dataValues.roleId = await Role.findByPk(user.dataValues.roleId)
                        user.dataValues.companyId = await Company.findByPk(user.dataValues.companyId)
                        user.dataValues.notificationTypeId = await user.getNotification_types()
                        templase(200, "", user, true, res)
                    }
                    catch(e) { templase(500, e.message, [], true, res) }
                })
                .catch(err => templase(500, err.message, [], true, res));
        }
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectCreate = (req, res) => {
    try {
        let token = req.headers["x-access-token"];
        let {body} = req
        let pwd = Math.random().toString(36).slice(2)
        if(!token) return templase(401, translation.language(req.headers.lang, "TokenNotProvided"), [],false, res)

        jwt.verify(token, config.secret, (err, decoded) => {
            if(err) return templase(401, translation.language(req.headers.lang, "Unauthorised"), [],false, res)
            User.findByPk(decoded.id)
                .then(async obj => {
                    if(!obj) templase(404, translation.language(req.headers.lang, "UserNotFound"), [], true, res)
                    try {
                        if (obj.roleId === 2) {
                            if (body.roleId === 3) {
                                templase(403, translation.language(req.headers.lang, "ReqSuperAdminRole"), [], true, res)
                            }
                            else {
                                body.password = bcrypt.hashSync(pwd, 8)
                                body.roleId = body.roleId !== undefined ? body.roleId: 1
                                User.create(body).then(user => {
                                    if(body.notificationTypeId) {
                                        for(let obj of body.notificationTypeId) {
                                            NotificationType.create({notificationId: obj, userId: user.id})
                                        }
                                    }
                                    if(user) {
                                        /****************************************************************************************************/
                                        /*                         Рассылка писем для зарегестрированных пользователей                      */
                                        /****************************************************************************************************/
                                        let transporter = nodemailer.createTransport({
                                            host: 'smtp.yandex.ru',
                                            port: 465,
                                            secure: true,
                                            auth: {
                                                user: 'info@winext.kz',
                                                pass: 'Inert2012'
                                            }
                                        });
                                        let result = transporter.sendMail({
                                            from: '"Winext Innovations Company" <info@winext.kz>',
                                            to: [body.email],
                                            subject: "Подтверждение регистрации",
                                            text: "You have successfully registered on Cooler Winext.",
                                            html: "<!DOCTYPE html>" +
                                                "<html lang=\"ru\">" +
                                                "<head>" +
                                                "    <meta charset=\"UTF-8\">" +
                                                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                                                "    <title>Подтверждение регистрации</title>" +
                                                "    <style>" +
                                                "        body{" +
                                                "            width: 600px;" +
                                                "            margin: 0;" +
                                                "            padding: 0;" +
                                                "        }" +
                                                "        .header{" +
                                                "            background-color: #002060;" +
                                                "            display: flex;" +
                                                "            justify-content:center;" +
                                                "        }" +
                                                "        .header h1{" +
                                                "            padding-top: 20px;" +
                                                "            text-align: center;" +
                                                "            font-size: 18px;" +
                                                "            color: #fff;" +
                                                "            padding-bottom: 20px;" +
                                                "        }" +
                                                "        .header .img img{" +
                                                "            width: 90px;" +
                                                "        }" +
                                                "        .footer{" +
                                                "            padding-top: 20px;" +
                                                "            padding: 20px;" +
                                                "            background-color: #002060;" +
                                                "            display: flex;" +
                                                "            color: #fff;" +
                                                "            justify-content:space-between;" +
                                                "        }" +
                                                "        .footer a{" +
                                                "            text-decoration:  none;" +
                                                "            color: #fff;" +
                                                "        }" +
                                                "        .content{" +
                                                "            padding: 20px;" +
                                                "        }" +
                                                "    </style>" +
                                                "</head>" +
                                                "<body>" +
                                                "    <div class=\"header\">" +
                                                "        <div>" +
                                                "            <h1>Подтверждение регистрации</h1>" +
                                                "        </div>" +
                                                "    </div>" +
                                                "    <div class=\"content\">" +
                                                "        <p>Уважаемый пользователь! Вы только что зарегистрировались в личном кабинете системы «Cooler»</p>" +
                                                "        <p>Ваш логин: " + body.email +
                                                "        <br>Ваш пароль: " + pwd + "</p>" +
                                                "        <p>Вы можете перейти в личный кабинет по ссылке  <a href=\"https://cooler.winext.kz/login\">cooler.winext.kz</a></p>" +
                                                "        <p>Если вы не регистрировались в системе, пожалуйста, проигнорируйте это письмо или сообщите нам об этом: <a href=\"mailto:support@winext.kz\">support@winext.kz</a></p>" +
                                                "    </div>" +
                                                "    <div class=\"footer\">" +
                                                "        <div><img src=\"https://bmanhole2.winext.kz/uploads/winextLogoEmail.png\" alt=\"\"></div>" +
                                                "        <div>" +
                                                "            <a href=\"http://www.winext.kz\">www.winext.kz</a><br>" +
                                                "            <a href=\"tel:+77172972713\">+7 (7172) 97-27-13</a><br>" +
                                                "            <a href=\"mailto:info@winext.kz\">info@winext.kz</a><br>" +
                                                "        </div>" +
                                                "    </div>" +
                                                "</body>" +
                                                "</html>"
                                        });
                                        templase(200, translation.language(req.headers.lang, "UserRegistered"),[],false, res)
                                    }
                                    else templase(500, "",[],false, res)
                                }).catch(err => { templase(500, err.message,[],false, res) });
                            }
                        }
                        else {
                            body.password = bcrypt.hashSync(pwd, 8)
                            body.roleId = body.roleId !== undefined ? body.roleId: 1
                            User.create(body).then(user => {
                                if(body.notificationTypeId) {
                                    for(let obj of body.notificationTypeId) {
                                        NotificationType.create({notificationId: obj, userId: user.id})
                                    }
                                }
                                if (user) {
                                    /****************************************************************************************************/
                                    /*                         Рассылка писем для зарегестрированных пользователей                      */
                                    /****************************************************************************************************/
                                    let transporter = nodemailer.createTransport({
                                        host: 'smtp.yandex.ru',
                                        port: 465,
                                        secure: true,
                                        auth: {
                                            user: 'info@winext.kz',
                                            pass: 'Inert2012'
                                        }
                                    });
                                    let result = transporter.sendMail({
                                        from: '"Winext Innovations Company" <info@winext.kz>',
                                        to: [body.email],
                                        subject: "Подтверждение регистрации",
                                        text: "You have successfully registered on Cooler Winext.",
                                        html: "<!DOCTYPE html>" +
                                            "<html lang=\"ru\">" +
                                            "<head>" +
                                            "    <meta charset=\"UTF-8\">" +
                                            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                                            "    <title>Подтверждение регистрации</title>" +
                                            "    <style>" +
                                            "        body{" +
                                            "            width: 600px;" +
                                            "            margin: 0;" +
                                            "            padding: 0;" +
                                            "        }" +
                                            "        .header{" +
                                            "            background-color: #002060;" +
                                            "            display: flex;" +
                                            "            justify-content:center;" +
                                            "        }" +
                                            "        .header h1{" +
                                            "            padding-top: 20px;" +
                                            "            text-align: center;" +
                                            "            font-size: 18px;" +
                                            "            color: #fff;" +
                                            "            padding-bottom: 20px;" +
                                            "        }" +
                                            "        .header .img img{" +
                                            "            width: 90px;" +
                                            "        }" +
                                            "        .footer{" +
                                            "            padding-top: 20px;" +
                                            "            padding: 20px;" +
                                            "            background-color: #002060;" +
                                            "            display: flex;" +
                                            "            color: #fff;" +
                                            "            justify-content:space-between;" +
                                            "        }" +
                                            "        .footer a{" +
                                            "            text-decoration:  none;" +
                                            "            color: #fff;" +
                                            "        }" +
                                            "        .content{" +
                                            "            padding: 20px;" +
                                            "        }" +
                                            "    </style>" +
                                            "</head>" +
                                            "<body>" +
                                            "    <div class=\"header\">" +
                                            "        <div>" +
                                            "            <h1>Подтверждение регистрации</h1>" +
                                            "        </div>" +
                                            "    </div>" +
                                            "    <div class=\"content\">" +
                                            "        <p>Уважаемый пользователь! Вы только что зарегистрировались в личном кабинете системы «Cooler»</p>" +
                                            "        <p>Ваш логин: " + body.email +
                                            "        <br>Ваш пароль: " + pwd + "</p>" +
                                            "        <p>Вы можете перейти в личный кабинет по ссылке  <a href=\"https://cooler.winext.kz/login\">cooler.winext.kz</a></p>" +
                                            "        <p>Если вы не регистрировались в системе, пожалуйста, проигнорируйте это письмо или сообщите нам об этом: <a href=\"mailto:support@winext.kz\">support@winext.kz</a></p>" +
                                            "    </div>" +
                                            "    <div class=\"footer\">" +
                                            "        <div><img src=\"https://bmanhole2.winext.kz/uploads/winextLogoEmail.png\" alt=\"\"></div>" +
                                            "        <div>" +
                                            "            <a href=\"http://www.winext.kz\">www.winext.kz</a><br>" +
                                            "            <a href=\"tel:+77172972713\">+7 (7172) 97-27-13</a><br>" +
                                            "            <a href=\"mailto:info@winext.kz\">info@winext.kz</a><br>" +
                                            "        </div>" +
                                            "    </div>" +
                                            "</body>" +
                                            "</html>"
                                    });
                                    templase(200, translation.language(req.headers.lang, "UserRegistered"),[],false, res)
                                }
                                else templase(500, "",[],false, res)
                            }).catch(err => {templase(500, err.message,[],false, res)});
                        }
                    }
                    catch(e) { templase(500, e.message, [], true, res) }
                })
                .catch(err => templase(500, err.message, [], true, res));
        })
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectRegister = (req, res) => {
    try {
        let {body} = req
        let pwd = Math.random().toString(36).slice(2)

        body.password = bcrypt.hashSync(pwd, 8)
        body.active = false
        body.roleId = 2
        User.create(body)
            .then(user => {
                if(user) {
                    /****************************************************************************************************/
                    /*                              Рассылка писем для регистрации пользователей                        */
                    /****************************************************************************************************/
                    let transporter = nodemailer.createTransport({
                        host: 'smtp.yandex.ru',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'info@winext.kz',
                            pass: 'Inert2012'
                        }
                    });
                    let result = transporter.sendMail({
                        from: '"Winext Innovations Company" <info@winext.kz>',
                        to: "info@winext.kz",
                        subject: "Подтверждение регистрации",
                        text: "Registration on Cooler Winext.",
                        html: "<!DOCTYPE html>" +
                            "<html lang=\"ru\">" +
                            "<head>" +
                            "    <meta charset=\"UTF-8\">" +
                            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                            "    <title>Подтверждение регистрации</title>" +
                            "    <style>" +
                            "        body{" +
                            "            width: 600px;" +
                            "            margin: 0;" +
                            "            padding: 0;" +
                            "        }" +
                            "        .header{" +
                            "            background-color: #002060;" +
                            "            display: flex;" +
                            "            justify-content:center;" +
                            "        }" +
                            "        .header h1{" +
                            "            padding-top: 20px;" +
                            "            text-align: center;" +
                            "            font-size: 18px;" +
                            "            color: #fff;" +
                            "            padding-bottom: 20px;" +
                            "        }" +
                            "        .header .img img{" +
                            "            width: 90px;" +
                            "        }" +
                            "        .footer{" +
                            "            padding-top: 20px;" +
                            "            padding: 20px;" +
                            "            background-color: #002060;" +
                            "            display: flex;" +
                            "            color: #fff;" +
                            "            justify-content:space-between;" +
                            "        }" +
                            "        .footer a{" +
                            "            text-decoration:  none;" +
                            "            color: #fff;" +
                            "        }" +
                            "        .content{" +
                            "            padding: 20px;" +
                            "        }" +
                            "    </style>" +
                            "</head>" +
                            "<body>" +
                            "    <div class=\"header\">" +
                            "        <div>" +
                            "            <h1>Подтверждение регистрации</h1>" +
                            "        </div>" +
                            "    </div>" +
                            "    <div class=\"content\">" +
                            "        <p>Пользователь подал заявку на регистрацию в систему «Cooler»</p>" +
                            "        <p>Имя: " + body.name +
                            "        <br>Фамилия: " + body.surname +
                            "        <br>Email: " + body.email + "</p>" +
                            "        <p>Для подтверждения, перейдите по ссылке  <a href=\"https://cooler.winext.kz/login\">cooler.winext.kz</a></p>" +
                            "    </div>" +
                            "    <div class=\"footer\">" +
                            "        <div><img src=\"https://bmanhole2.winext.kz/uploads/winextLogoEmail.png\" alt=\"\"></div>" +
                            "        <div>" +
                            "            <a href=\"http://www.winext.kz\">www.winext.kz</a><br>" +
                            "            <a href=\"tel:+77172972713\">+7 (7172) 97-27-13</a><br>" +
                            "            <a href=\"mailto:info@winext.kz\">info@winext.kz</a><br>" +
                            "        </div>" +
                            "    </div>" +
                            "</body>" +
                            "</html>"
                    });
                    let result2 = transporter.sendMail({
                        from: '"Winext Innovations Company" <info@winext.kz>',
                        to: [body.email],
                        subject: "Подтверждение регистрации",
                        text: "Registration on Cooler Winext.",
                        html: "<!DOCTYPE html>" +
                            "<html lang=\"ru\">" +
                            "<head>" +
                            "    <meta charset=\"UTF-8\">" +
                            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                            "    <title>Подтверждение регистрации</title>" +
                            "    <style>" +
                            "        body{" +
                            "            width: 600px;" +
                            "            margin: 0;" +
                            "            padding: 0;" +
                            "        }" +
                            "        .header{" +
                            "            background-color: #002060;" +
                            "            display: flex;" +
                            "            justify-content:center;" +
                            "        }" +
                            "        .header h1{" +
                            "            padding-top: 20px;" +
                            "            text-align: center;" +
                            "            font-size: 18px;" +
                            "            color: #fff;" +
                            "            padding-bottom: 20px;" +
                            "        }" +
                            "        .header .img img{" +
                            "            width: 90px;" +
                            "        }" +
                            "        .footer{" +
                            "            padding-top: 20px;" +
                            "            padding: 20px;" +
                            "            background-color: #002060;" +
                            "            display: flex;" +
                            "            color: #fff;" +
                            "            justify-content:space-between;" +
                            "        }" +
                            "        .footer a{" +
                            "            text-decoration:  none;" +
                            "            color: #fff;" +
                            "        }" +
                            "        .content{" +
                            "            padding: 20px;" +
                            "        }" +
                            "    </style>" +
                            "</head>" +
                            "<body>" +
                            "    <div class=\"header\">" +
                            "        <div>" +
                            "            <h1>Подтверждение регистрации</h1>" +
                            "        </div>" +
                            "    </div>" +
                            "    <div class=\"content\">" +
                            "        <p>Вы подали заявку на регистрацию в систему «Cooler»</p>" +
                            "        <p>Ваш логин: " + body.email +
                            "        <br>Ваш пароль: " + pwd + "</p>" +
                            "        <br>В данный момент ваш аккаунт не активен, пожалуйста подождите активацию вашего ааканта!" +
                            "        <p>После активации, вы можете перейти в личный кабинет по ссылке  <a href=\"https://cooler.winext.kz/login\">cooler.winext.kz</a></p>" +
                            "        <p>Если вы не регистрировались в системе, пожалуйста, проигнорируйте это письмо или сообщите нам об этом: <a href=\"mailto:support@winext.kz\">support@winext.kz</a></p>" +
                            "    </div>" +
                            "    <div class=\"footer\">" +
                            "        <div><img src=\"https://bmanhole2.winext.kz/uploads/winextLogoEmail.png\" alt=\"\"></div>" +
                            "        <div>" +
                            "            <a href=\"http://www.winext.kz\">www.winext.kz</a> br>" +
                            "            <a href=\"tel:+77172972713\">+7 (7172) 97-27-13</a><br>" +
                            "            <a href=\"mailto:info@winext.kz\">info@winext.kz</a><br>" +
                            "        </div>" +
                            "    </div>" +
                            "</body>" +
                            "</html>"
                    });
                    templase(200, translation.language(req.headers.lang, "UserRegistered"),[],false, res)
                }
                else templase(500, "",[],false, res)
            })
            .catch(err => { templase(500, err.message,[],false, res) });
    } catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectUpdate = (req, res) => {
    try {
        let token = req.headers["x-access-token"];
        let {id} = req.params
        let {body} = req
        if(!token) return templase(401, translation.language(req.headers.lang, "TokenNotProvided"), [], false, res)

        jwt.verify(token, config.secret, (err, decoded) => {
            if(err) return templase(401, translation.language(req.headers.lang, "Unauthorised"), [],false, res)
            User.findByPk(decoded.id)
                .then(async obj => {
                    if(!obj) templase(404, translation.language(req.headers.lang, "UserNotFound"), [], true, res)
                    try {
                        if(obj.roleId === 2) {
                            User.findByPk(id)
                                .then(async user => {
                                    if(user.roleId === 3) {
                                        templase(403, translation.language(req.headers.lang, "ReqSuperAdminRole"), [], true, res)
                                    }
                                    else {
                                        try {
                                            if(body.email !== user.dataValues.email && body.email !== "") {
                                                let DBemail = await User.findAll({where: {email: body.email}})
                                                if(DBemail.length > 0) {
                                                    templase(409, translation.language(req.headers.lang, "ExistedEmail"), [], true, res)
                                                    return false;
                                                }
                                            }
                                            if(body.oldpassword && body.password) {
                                                let passwordIsValid = bcrypt.compareSync(body.oldpassword, user.password);
                                                if(passwordIsValid) body.password = bcrypt.hashSync(body.password, 8)
                                                else {
                                                    templase(400, translation.language(req.headers.lang, "IncorrectOldPwd"), [], true, res)
                                                    return false
                                                }
                                                User.update(body, {where: {id: id}})
                                                    .then(async (response) => {
                                                        if (response[0]) {
                                                            if(!!body.notificationTypeId) {
                                                                let userNT = await User_NT.findAll({where: {userId: user.dataValues.id}})
                                                                if(body.notificationTypeId !== null && body.notificationTypeId !== undefined && body.notificationTypeId.length > 0) {
                                                                    if(userNT.length > 0) {
                                                                        User_NT.destroy({where: {userId: user.dataValues.id}})
                                                                        for(let each of body.notificationTypeId) {
                                                                            User_NT.create({notificationTypeId: each, userId: user.dataValues.id})
                                                                        }
                                                                    }
                                                                    else {
                                                                        for(let each of body.notificationTypeId) {
                                                                            User_NT.create({notificationTypeId: each, userId: user.dataValues.id})
                                                                        }
                                                                    }
                                                                }
                                                                else {
                                                                    if(userNT.length > 0) {
                                                                        User_NT.destroy({where: {userId: user.dataValues.id}})
                                                                    }
                                                                }
                                                            }
                                                            templase(200, translation.language(req.headers.lang, "ObjectUpdated"), [], true, res)
                                                        }
                                                    })
                                                    .catch(e => {templase(500, e.message, [], true, res)});
                                            }
                                            else {
                                                delete body.password
                                                User.update(body, {where: {id: id}})
                                                    .then(async (response) => {
                                                        if (response[0]) {
                                                            if(!!body.notificationTypeId) {
                                                                let userNT = await User_NT.findAll({where: {userId: user.dataValues.id}})
                                                                if(body.notificationTypeId !== null && body.notificationTypeId !== undefined && body.notificationTypeId.length > 0) {
                                                                    if(userNT.length > 0) {
                                                                        User_NT.destroy({where: {userId: user.dataValues.id}})
                                                                        for(let each of body.notificationTypeId) {
                                                                            User_NT.create({notificationTypeId: each, userId: user.dataValues.id})
                                                                        }
                                                                    }
                                                                    else {
                                                                        for(let each of body.notificationTypeId) {
                                                                            User_NT.create({notificationTypeId: each, userId: user.dataValues.id})
                                                                        }
                                                                    }
                                                                }
                                                                else {
                                                                    if(userNT.length > 0) {
                                                                        User_NT.destroy({where: {userId: user.dataValues.id}})
                                                                    }
                                                                }
                                                            }
                                                            templase(200, translation.language(req.headers.lang, "ObjectUpdated"), [], true, res)
                                                        }
                                                    })
                                                    .catch(e => {templase(500, e.message, [], true, res)});
                                            }
                                        }
                                        catch(e) { templase(500, e.message, [], true, res) }
                                    }
                                }).catch(err => templase(500, err.message, [], true, res));
                        }
                        else {
                            User.findByPk(id)
                                .then(async user => {
                                    try {
                                        if(body.email !== user.dataValues.email && body.email !== "") {
                                            let emailDatabase = await User.findAll({where: {email: body.email}})
                                            if (emailDatabase.length > 0) {
                                                templase(409, translation.language(req.headers.lang, "ExistedEmail"), [], true, res)
                                                return false;
                                            }
                                        }
                                        if(body.oldpassword && body.password) {
                                            let passwordIsValid = bcrypt.compareSync(body.oldpassword, user.password);
                                            if (passwordIsValid) body.password = bcrypt.hashSync(body.password, 8)
                                            else {
                                                templase(400, translation.language(req.headers.lang, "IncorrectOldPwd"), [], true, res)
                                                return false
                                            }
                                            User.update(body, {where: {id: id}})
                                                .then(async (response) => {
                                                    if (response[0]) {
                                                        if(!!body.notificationTypeId) {
                                                            let userNT = await User_NT.findAll({where: {userId: user.dataValues.id}})
                                                            if(body.notificationTypeId !== null && body.notificationTypeId !== undefined && body.notificationTypeId.length > 0) {
                                                                if(userNT.length > 0) {
                                                                    User_NT.destroy({where: {userId: user.dataValues.id}})
                                                                    for(let each of body.notificationTypeId) {
                                                                        User_NT.create({notificationTypeId: each, userId: user.dataValues.id})
                                                                    }
                                                                }
                                                                else {
                                                                    for(let each of body.notificationTypeId) {
                                                                        User_NT.create({notificationTypeId: each, userId: user.dataValues.id})
                                                                    }
                                                                }
                                                            }
                                                            else {
                                                                if(userNT.length > 0) {
                                                                    User_NT.destroy({where: {userId: user.dataValues.id}})
                                                                }
                                                            }
                                                        }
                                                        templase(200, translation.language(req.headers.lang, "ObjectUpdated"), [], true, res)
                                                    }
                                                })
                                                .catch(e => {templase(500, e.message, [], true, res)});
                                        }
                                        else {
                                            delete body.password
                                            User.update(body, {where: {id: id}})
                                                .then(async (response) => {
                                                    if (response[0]) {
                                                        if(!!body.notificationTypeId) {
                                                            let userNT = await User_NT.findAll({where: {userId: user.dataValues.id}})
                                                            if(body.notificationTypeId !== null && body.notificationTypeId !== undefined && body.notificationTypeId.length > 0) {
                                                                if(userNT.length > 0) {
                                                                    User_NT.destroy({where: {userId: user.dataValues.id}})
                                                                    for(let each of body.notificationTypeId) {
                                                                        User_NT.create({notificationTypeId: each, userId: user.dataValues.id})
                                                                    }
                                                                }
                                                                else {
                                                                    for(let each of body.notificationTypeId) {
                                                                        User_NT.create({notificationTypeId: each, userId: user.dataValues.id})
                                                                    }
                                                                }
                                                            }
                                                            else {
                                                                if(userNT.length > 0) {
                                                                    User_NT.destroy({where: {userId: user.dataValues.id}})
                                                                }
                                                            }
                                                        }
                                                        templase(200, translation.language(req.headers.lang, "ObjectUpdated"), [], true, res)
                                                    }
                                                })
                                                .catch(e => {templase(500, e.message, [], true, res)});
                                        }
                                    }
                                    catch(e) { templase(500, e.message, [], true, res) }
                                }).catch(err => templase(500, err.message, [], true, res));
                        }
                    }
                    catch(e) { templase(500, e.message, [], true, res) }
                }).catch(err => templase(500, err.message, [], true, res));
        })
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectDelete = (req, res) => {
    try {
        let token = req.headers["x-access-token"];
        let {id} = req.params
        if (!token) return templase(401, translation.language(req.headers.lang, "TokenNotProvided"), [], false, res)

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) return templase(401, translation.language(req.headers.lang, "Unauthorised"), [], false, res)
            User.findByPk(decoded.id)
                .then(async user => {
                    if (!user) templase(404, translation.language(req.headers.lang, "UserNotFound"), [], true, res)
                    try {
                        if(user.roleId === 3) {
                            NotificationType.destroy({where: {userId: id}})
                            User.destroy({where: {id: id}})
                                .then((response) => {
                                    if (response === 1) templase(200, translation.language(req.headers.lang, "ObjectDeleted"), [], true, res)
                                    else templase(404, translation.language(req.headers.lang, "UserNotFound"), [], true, res)
                                }).catch(e => {templase(500, e.message, [], true, res)});
                        }
                        else {
                            User.findByPk(id).then(
                                async object => {
                                    if(object.roleId === 3) {
                                        templase(403, translation.language(req.headers.lang, "ReqSuperAdminRole"), [], true, res)
                                    }
                                    else {
                                        NotificationType.destroy({where: {userId: id}})
                                        User.destroy({where: {id: id}})
                                            .then((response) => {
                                                if (response === 1) templase(200, translation.language(req.headers.lang, "ObjectDeleted"), [], true, res)
                                                else templase(404, translation.language(req.headers.lang, "UserNotFound"), [], true, res)
                                            }).catch(e => {templase(500, e.message, [], true, res)});
                                    }
                                }).catch(e => {templase(500, e.message, [], true, res)});
                        }
                    }
                    catch(e) { templase(500, e.message, [], true, res) }
                }).catch(err => templase(500, err.message, [], true, res));
        });
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.checkEmail = (req, res) => {
    try{
        let {body} = req
        User.findOne({where: {email: body.email}})
            .then(user => {
                if(!user) templase(401, translation.language(req.headers.lang, "InvalidEmail"), [], true, res)
                var token = jwt.sign({id: user.id}, config.secret, {expiresIn: 7200}); // 24 hours
                /****************************************************************************************************/
                /*                               Рассылка писем для восстановления паролей                          */
                /****************************************************************************************************/
                let transporter = nodemailer.createTransport({
                    host: 'smtp.yandex.ru',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'info@winext.kz',
                        pass: 'Inert2012'
                    }
                });
                let result = transporter.sendMail({
                    from: '"Winext Innovations Company" <info@winext.kz>',
                    to: body.email,
                    subject: "Восстановление пароля",
                    text: "Click on the link below.",
                    html: "<!DOCTYPE html>" +
                        "<html lang=\"ru\">" +
                        "<head>" +
                        "    <meta charset=\"UTF-8\">" +
                        "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                        "    <title>Восстановление пароля</title>" +
                        "    <style>" +
                        "        body{" +
                        "            width: 600px;" +
                        "            margin: 0;" +
                        "            padding: 0;" +
                        "        }" +
                        "        .header{" +
                        "            background-color: #002060;" +
                        "            display: flex;" +
                        "            justify-content:center;" +
                        "        }" +
                        "        .header h1{" +
                        "            padding-top: 20px;" +
                        "            text-align: center;" +
                        "            font-size: 18px;" +
                        "            color: #fff;" +
                        "            padding-bottom: 20px;" +
                        "        }" +
                        "        .header .img img{" +
                        "            width: 90px;" +
                        "        }" +
                        "        .footer{" +
                        "            padding-top: 20px;" +
                        "            padding: 20px;" +
                        "            background-color: #002060;" +
                        "            display: flex;" +
                        "            color: #fff;" +
                        "            justify-content:space-between;" +
                        "        }" +
                        "        .footer a{" +
                        "            text-decoration:  none;" +
                        "            color: #fff;" +
                        "        }" +
                        "        .content{" +
                        "            padding: 20px;" +
                        "        }" +
                        "    </style>" +
                        "</head>" +
                        "<body>" +
                        "    <div class=\"header\">" +
                        "        <div>" +
                        "            <h1>Восстановление пароля </h1>" +
                        "        </div>" +
                        "    </div>" +
                        "    <div class=\"content\">" +
                        "        <p>Уважаемый пользователь!</p>" +
                        "        <p>Вы получили данное письмо, поскольку нам был направлен запрос на сброс пароля.</p>" +
                        "        <p>Чтобы сбросить пароль, нажмите на ссылку ниже: <a href=\"https://cooler.winext.kz/resetpassword/" + token + "\">https://cooler.winext.kz/resetpassword/" + token + "</a></p>" +
                        "        <p>Если вы не запрашивали сброс пароля, пожалуйста, проигнорируйте это письмо или сообщите нам об этом: <a href=\"mailto:support@winext.kz\">support@winext.kz</a></p>" +
                        "    </div>" +
                        "    <div class=\"footer\">" +
                        "        <div><img src=\"https://bmanhole2.winext.kz/uploads/winextLogoEmail.png\" alt=\"\"></div>" +
                        "        <div>" +
                        "            <a href=\"http://www.winext.kz\">www.winext.kz</a><br>" +
                        "            <a href=\"tel:+77172972713\">+7 (7172) 97-27-13</a><br>" +
                        "            <a href=\"mailto:info@winext.kz\">info@winext.kz</a><br>" +
                        "        </div>" +
                        "    </div>" +
                        "</body>" +
                        "</html>"
                });
                templase(200, "", [], true, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.resetPassword = (req, res) => {
    try {
        let token = req.headers["x-access-token"];
        let {body} = req
        if(!token) return templase(401, translation.language(req.headers.lang, "TokenNotProvided"), [], true, res)

        jwt.verify(token, config.secret, (err, decoded) => {
            if(err) return templase(401, translation.language(req.headers.lang, "Unauthorised"), [], true, res)
            User.findByPk(decoded.id)
                .then(async user => {
                    if(!user) templase(404, translation.language(req.headers.lang, "UserNotFound"), [], true, res)
                    try {
                        if(body.password) {
                            body.password = bcrypt.hashSync(body.password, 8)
                            User.update(body, {where: {id: decoded.id}})
                                .then((response) => {
                                    if(response[0]) {
                                        templase(200, translation.language(req.headers.lang, "PwdChanged"), [], true, res)
                                        /****************************************************************************************************/
                                        /*                               Рассылка писем для восстановления паролей                          */
                                        /****************************************************************************************************/
                                        let transporter = nodemailer.createTransport({
                                            host: 'smtp.yandex.ru',
                                            port: 465,
                                            secure: true,
                                            auth: {
                                                user: 'info@winext.kz',
                                                pass: 'Inert2012'
                                            }
                                        });
                                        let result = transporter.sendMail({
                                            from: '"Winext Innovations Company" <info@winext.kz>',
                                            to: body.email,
                                            subject: "Восстановление пароля",
                                            text: "Click on the link below.",
                                            html: "<!DOCTYPE html>" +
                                                "<html lang=\"ru\">" +
                                                "<head>" +
                                                "    <meta charset=\"UTF-8\">" +
                                                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                                                "    <title>Восстановление пароля</title>" +
                                                "    <style>" +
                                                "        body{" +
                                                "            width: 600px;" +
                                                "            margin: 0;" +
                                                "            padding: 0;" +
                                                "        }" +
                                                "        .header{" +
                                                "            background-color: #002060;" +
                                                "            display: flex;" +
                                                "            justify-content:center;" +
                                                "        }" +
                                                "        .header h1{" +
                                                "            padding-top: 20px;" +
                                                "            text-align: center;" +
                                                "            font-size: 18px;" +
                                                "            color: #fff;" +
                                                "            padding-bottom: 20px;" +
                                                "        }" +
                                                "        .header .img img{" +
                                                "            width: 90px;" +
                                                "        }" +
                                                "        .footer{" +
                                                "            padding-top: 20px;" +
                                                "            padding: 20px;" +
                                                "            background-color: #002060;" +
                                                "            display: flex;" +
                                                "            color: #fff;" +
                                                "            justify-content:space-between;" +
                                                "        }" +
                                                "        .footer a{" +
                                                "            text-decoration:  none;" +
                                                "            color: #fff;" +
                                                "        }" +
                                                "        .content{" +
                                                "            padding: 20px;" +
                                                "        }" +
                                                "    </style>" +
                                                "</head>" +
                                                "<body>" +
                                                "    <div class=\"header\">" +
                                                "        <div>" +
                                                "            <h1>Восстановление пароля </h1>" +
                                                "        </div>" +
                                                "    </div>" +
                                                "    <div class=\"content\">" +
                                                "        <p>Уважаемый пользователь!</p>" +
                                                "        <p>Вы получили данное письмо, поскольку нам был направлен запрос на сброс пароля.</p>" +
                                                "        <p>Чтобы сбросить пароль, нажмите на ссылку ниже: <a href=\"https://cooler.winext.kz/resetpassword/" + token + "\">https://cooler.winext.kz/resetpassword/" + token + "</a></p>" +
                                                "        <p>Если вы не запрашивали сброс пароля, пожалуйста, проигнорируйте это письмо или сообщите нам об этом: <a href=\"mailto:support@winext.kz\">support@winext.kz</a></p>" +
                                                "    </div>" +
                                                "    <div class=\"footer\">" +
                                                "        <div><img src=\"https://bmanhole2.winext.kz/uploads/winextLogoEmail.png\" alt=\"\"></div>" +
                                                "        <div>" +
                                                "            <a href=\"http://www.winext.kz\">www.winext.kz</a><br>" +
                                                "            <a href=\"tel:+77172972713\">+7 (7172) 97-27-13</a><br>" +
                                                "            <a href=\"mailto:info@winext.kz\">info@winext.kz</a><br>" +
                                                "        </div>" +
                                                "    </div>" +
                                                "</body>" +
                                                "</html>"
                                        });
                                        Token.create({token: token});
                                    }
                                }).catch(e => {templase(500, e.message, [], true, res)})
                        }
                    }
                    catch(e) { templase(500, e.message, [], true, res) }
                }).catch(err => {templase(500, err.message, [], true, res)})
        })
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.checkToken = (req, res) => {
    templase(200, "", [], true, res)
};

exports.checkUserByToken = (req, res) => {
    try {
        let token = req.headers["x-access-token"];
        if (!token) return templase(401, translation.language(req.headers.lang, "TokenNotProvided"), [], false, res)
        jwt.verify(token, config.secret, (err, decoded) => {
            if(err) return templase(401, translation.language(req.headers.lang, "Unauthorised"), [], false, res)
            User.findByPk(decoded.id)
                .then(async obj => {
                    if (!obj) templase(404, translation.language(req.headers.lang, "UserNotFound"), [], true, res)
                    try {
                        delete obj.dataValues.password
                        obj.dataValues.roleId = await Role.findByPk(obj.dataValues.roleId)
                        obj.dataValues.companyId = await Company.findByPk(obj.dataValues.companyId)
                        obj.dataValues.firebaseToken = await fbt.findAll({where: {userId: obj.id}})
                        obj.dataValues.notificationTypeId = await obj.getNotification_types()
                        templase(200, "", obj, true, res)
                    }
                    catch (e) { templase(500, e.message, [], true, res) }
                }).catch(err => templase(500, err.message, [], true, res));
        });
    }
    catch(e) { templase(500, e.message, [], true, res) }
};
