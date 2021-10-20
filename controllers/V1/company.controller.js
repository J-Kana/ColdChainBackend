const db = require("../../models");
const templase = require("../../templaseResponse");
const nodemailer = require('nodemailer');
const translation = require("../../other/languages");
const Company = db.company, User = db.user, Role = db.role;

exports.getAllObject = async (req, res) => {
    try {
        let userId = await User.findOne({where: {id: req.userId}})
        let result = []
        if(userId.dataValues.roleId === 3) {
            Company.findAll({order: [['id', 'DESC']]})
                .then(async objects => {
                    if(objects.length === 0) templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
                    else templase(200, "", objects, true, res)
                }).catch(err => {templase(500, err.message, [], true, res)})
        }
        else if(userId.dataValues.roleId === 2) {
            let company = await Company.findOne({where: {id: userId.dataValues.companyId}})
            result.push(company)
            let objCompany = await getAllCompanies(company, result)
            templase(200, "", objCompany, true, res)
        }
        else {
            Company.findAll({where: {id: userId.dataValues.companyId}})
                .then(async objects => {
                    if(objects.length === 0) templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
                    else templase(200, "", objects, true, res)
                }).catch(err => {templase(500, err.message, [], true, res)})
        }

        // Function that gets all the companies related to one main company
        async function getAllCompanies(company, result) {
            try {
                let nextCompany = await Company.findAll({where: {parent_company: company.dataValues.id}})
                if(nextCompany.length > 0) {
                    for(let each of nextCompany) {
                        for(let eachResult of result) {
                            if(each.dataValues.id !== eachResult.dataValues.id) {
                                result.push(each);
                            }
                        }
                        await getAllCompanies(each, result);
                    }
                }
                return [...new Set(result)];
            }
            catch(e) { templase(500, e.message, [], true, res) }
        }
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.getObject = (req, res) => {
    try {
        let {id} = req.params
        if(id) {
            Company.findByPk(id)
                .then(async object => {
                    if(!object) templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
                    try {
                        templase(200, "", object, true ,res)
                    }
                    catch(e) { templase(500, e.message, [], true, res) }
                }).catch(err => {templase(500, err.message, [], true, res)})
        }
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectCreate = (req, res) => {
    try {
        let {body} = req
        Company.create(body)
            .then(object => {
                if(!object) templase(501, translation.language(req.headers.lang, "ObjectNotRegistered"), [], true, res)
                templase(200, translation.language(req.headers.lang, "ObjectRegistered"), object, true, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectRegister = (req, res) => {
    try {
        let {body} = req
        body.active = false
        Company.create(body)
            .then(object => {
                if(object) {
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
                        text: "Registration on Cooler.",
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
                            "           <p>Компания: " + body.comp_name +
                            "           <br>Имя: " + body.name +
                            "           <br>Фамилия: " + body.surname +
                            "           <br>Email: " + body.email +
                            "           <br>Телефон: " + body.phone + "</p>" +
                            "           <p>Для подтверждения, перейдите по ссылке  <a href=\"https://cooler.winext.kz/login\">cooler.winext.kz</a></p>" +
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
                    templase(200, translation.language(req.headers.lang, "ObjectRegistered"), object, true, res)
                }
                else templase(501, translation.language(req.headers.lang, "ObjectNotRegistered"),[],false, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};

exports.objectUpdate = (req, res) => {
    try {
        let {id} = req.params
        let {body} = req
        Company.update(body, {where: {id: id}})
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
        Company.destroy({where: {id: id}})
            .then((response) => {
                if(response === 1) templase(200, translation.language(req.headers.lang, "ObjectDeleted"), [], true, res)
                else templase(404, translation.language(req.headers.lang, "ObjectNotFound"), [], true, res)
            }).catch(err => {templase(500, err.message, [], true, res)})
    }
    catch(e) { templase(500, e.message, [], true, res) }
};
