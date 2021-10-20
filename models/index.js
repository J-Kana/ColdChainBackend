const {Sequelize,DataTypes } = require("sequelize");
// Change the url to the localhost when connecting to the 213 machine
// const sequelize = new Sequelize('postgres://postgreadmin:postgres@185.125.44.213:5432/coldchain')
const sequelize = new Sequelize(`postgres://${process.env.USER_DB}:${process.env.PASSWORD_DB}@${process.env.HOST_DB}:${process.env.PORT_DB}/${process.env.DATABASE_DB}`)
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

/***********************************************************************************************************************************/
/*                                                            MODELS                                                               */
/***********************************************************************************************************************************/
/**************************************   ALL    **************************************/
db.user = require("./V1/user.model.js")(sequelize, DataTypes);
db.transport_geolocation = require("./V1/transport_geolocation.model.js")(sequelize, DataTypes);
db.token = require("./V1/token.model.js")(sequelize, DataTypes);
db.sensor_statistics = require("./V1/sensor_statistics.model.js")(sequelize, DataTypes);
db.sensor = require("./V1/sensor.model.js")(sequelize, DataTypes);
db.object_statistics = require("./V1/object_statistics.model.js")(sequelize, DataTypes);
db.object = require("./V1/object.model.js")(sequelize, DataTypes);
db.notification = require("./V1/notification.model.js")(sequelize, DataTypes);
db.medicaments = require("./V1/medicaments.model.js")(sequelize, DataTypes);
db.log = require("./V1/log.model.js")(sequelize, DataTypes);
db.gdp_verification = require("./V1/gdp_verification.model.js")(sequelize, DataTypes);
db.gdp_check = require("./V1/gdp_check.model.js")(sequelize, DataTypes);
db.firebase_token = require("./V1/firebase_token.model.js")(sequelize, DataTypes);
db.event = require("./V1/event.model.js")(sequelize, DataTypes);
db.doc_file = require("./V1/doc_file.model.js")(sequelize, DataTypes);
db.company = require("./V1/company.model.js")(sequelize, DataTypes);

/**************************************   LIST    **************************************/
db.role = require("./V1/Lists/role.model.js")(sequelize, DataTypes);
db.object_type = require("./V1/Lists/object_type.model.js")(sequelize, DataTypes);
db.notification_type = require("./V1/Lists/notification_type.model.js")(sequelize, DataTypes);
db.help = require("./V1/Lists/help.model.js")(sequelize, DataTypes);
db.faq = require("./V1/Lists/faq.model.js")(sequelize, DataTypes);

/**************************************   ASSOCIATION    **************************************/
db.user_notification_type = require("./V1/Associations/user.notification_type.association.js")(sequelize, DataTypes);

/***********************************************************************************************************************************/
/*                                                          ASSOCIATIONS                                                           */
/***********************************************************************************************************************************/
db.role.hasMany(db.user)
db.company.hasMany(db.user)
db.notification_type.belongsToMany(db.user, {through: db.user_notification_type})
db.user.belongsToMany(db.notification_type, {through: db.user_notification_type})
db.user.hasMany(db.firebase_token)

db.object.hasMany(db.sensor)
db.company.hasMany(db.sensor)

db.company.hasMany(db.object)
db.object_type.hasMany(db.object)

db.sensor.hasMany(db.gdp_check)
db.company.hasMany(db.gdp_check)

db.object.hasMany(db.gdp_verification)
db.company.hasMany(db.gdp_verification)

db.user.hasMany(db.event)
db.object.hasMany(db.event)
db.sensor.hasMany(db.event)
db.company.hasMany(db.event)

db.sensor.hasMany(db.notification)
db.company.hasMany(db.notification)

db.object.hasMany(db.medicaments)
db.object.hasMany(db.transport_geolocation)

db.object.hasMany(db.object_statistics)
db.user.hasMany(db.object_statistics)

db.gdp_check.hasMany(db.doc_file)
db.gdp_verification.hasMany(db.doc_file)
db.event.hasMany(db.doc_file)
db.company.hasMany(db.doc_file)
db.help.hasMany(db.doc_file)
db.faq.hasMany(db.doc_file)
/***********************************************************************************************************************************/

module.exports = db;
