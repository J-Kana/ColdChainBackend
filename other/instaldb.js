/***********************************************************************************************/
/*                                  CREATE FUNCTION                                            */
/***********************************************************************************************/
const db = require("../models/index");
const bcrypt = require("bcryptjs");
const User = db.user, Company = db.company, Role = db.role, Object_Type = db.object_type

function initial() {
    /**************************************************************/
    /************************   USER   ****************************/
    setTimeout(() => {
        User.create({
            name: "Winext",
            surname: "System",
            patronymic: "",
            email: "info@winext.kz",
            password: bcrypt.hashSync("qwer1212", 8),
            phone: "+7(777)-70=77-77-77",
            logo: "",
            active: true,
            roleId: 3,
            companyId: 1
        })
    }, 100)
    setTimeout(() => {
        User.create({
            name: "Clark",
            surname: "Kent",
            patronymic: "",
            email: "kent@ck.com",
            password: bcrypt.hashSync("qwerty", 6),
            phone: "+7000000000",
            logo: "",
            active: true,
            roleId: 2,
            companyId: 2
        })
    }, 200)
    /**************************************************************/
    /***********************   COMPANY   ***************************/
    Company.create({
        comp_name: "Company1",
        country: "Kazakhstan",
        city: "Nur-Sultan",
        street: "Baraeva",
        house: "55/1",
        office: "345",
        email: "company1.@comp.com",
        phone: "948234",
        work_phone: "9482344",
        fax: "",
        user_name: "qwer1",
        user_surname: "qwer1",
        user_patronymic: "",
        user_phone: "123",
        user_email: "qwer1@user.com",
        logo: "",
        active: true
    })
    Company.create({
        comp_name: "Company2",
        country: "Kazakhstan",
        city: "Nur-Sultan",
        street: "Baraeva",
        house: "55/2",
        office: "346",
        email: "company2.@comp.com",
        phone: "5134513",
        work_phone: "5134513",
        fax: "",
        user_name: "qwer2",
        user_surname: "qwer2",
        user_patronymic: "",
        user_phone: "456",
        user_email: "qwer2@user.com",
        logo: "",
        active: true
    })
    /***********************   ROLE   ***************************/
    Role.create({
        name: "Сотрудник",
        value: "User"
    })
    Role.create({
        name: "Админстратор",
        value: "Administrator"
    })
    Role.create({
        name: "Супер админстратор",
        value: "Super administrator"
    })
    /***********************   OBJECT TYPE   ***************************/
    Object_Type.create({
        name: "Здание",
        value: "Building"
    })
    Object_Type.create({
        name: "Транспорт",
        value: "Transport"
    })
    /***********************   EXAMPLES   ***************************/
    // setTimeout(() => {
    //     Company.findOne({where: {comp_name: "Company1"}})
    //         .then(company=>{
    //             if(!company) return;
    //
    //             // добавим Тому курс по JavaScript
    //             Device.findOne({where: {device_name: "device1"}})
    //                 .then(device=>{
    //                     if(!device) return;
    //                     company.addDevice(device, {through:{}});
    //                 });
    //             Device.findOne({where: {device_name: "device2"}})
    //                 .then(device=>{
    //                     if(!device) return;
    //                     company.addDevice(device, {through:{}});
    //                 });
    //         });
    // }, 3000)
    //
    // setTimeout(() => {
    //     Company.findOne({where: {comp_name: "Company1"}})
    //         .then(company=>{
    //             if(!company) return;
    //             company.getDevices().then(devices=>{
    //                 for(device of devices){
    //                     console.log(device.device_name);
    //                 }
    //             });
    //         });
    // }, 5000)
}
module.exports  =  initial