var CronJob = require('cron').CronJob;
const db = require("../models");
const Token = db.token;

var job = new CronJob( '0 0 */2 * *', function() {
    Token.destroy({where: {}})
        .catch(err => {console.log("ERROR" + err)})
}, null, true);

module.exports = job