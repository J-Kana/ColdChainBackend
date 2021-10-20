require('custom-env').env()
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require('path')
// const multer = require('multer')
const initial = require("./other/instaldb")
const tokenDelete = require("./Tasks/token_delete.task"), websocket = require("./Tasks/websocket.task");
const socketIo = require("socket.io");
const http = require("http");

var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
global.admin = admin

const app = express();
// let storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname + '/uploads/'))
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// })
// let upload = multer({ storage: storage })
// app.use(upload.single('logo'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'upload')))
app.use('/uploads',express.static(path.join(__dirname, 'uploads')))
app.use(cors( ''))
/***********************************************************************************************/
/*                                      CONSTANTS                                              */
/***********************************************************************************************/
const db = require("./models");
const User = db.user

/***********************************************************************************************/
/*                                      DATABASE                                               */
/***********************************************************************************************/
db.sequelize.sync();
// db.sequelize.sync({ alter: true }).then(() => {       // alter: true,     force: false
//    console.log('Drop and Re-sync Database');
//    // initial();
// });

/***********************************************************************************************/
/*                                  ASSIGNING ROUTES                                           */
/***********************************************************************************************/
require('./routes/V1/auth.routes')(app);
require('./routes/V1/company.routes')(app);
require('./routes/V1/doc_file.routes')(app);
require('./routes/V1/event.routes')(app);
require('./routes/V1/gdp_check.routes')(app);
require('./routes/V1/gdp_verification.routes')(app);
require('./routes/V1/medicaments.routes')(app);
require('./routes/V1/notification.routes')(app);
require('./routes/V1/object.routes')(app);
require('./routes/V1/object_statistics.routes')(app);
require('./routes/V1/sensor.routes')(app);
require('./routes/V1/sensor_statistics.routes')(app);
require('./routes/V1/transport_geolocation.routes')(app);
require('./routes/V1/user.routes')(app);

/*********************      LISTS       ******************/
require('./routes/V1/Lists/faq.routes')(app);
require('./routes/V1/Lists/help.routes')(app);
require('./routes/V1/Lists/notification_type.routes')(app);
require('./routes/V1/Lists/object_type.routes')(app);
require('./routes/V1/Lists/role.routes')(app);
require('./routes/V1/firebase_token.routes')(app);

/***********************************************************************************************/

// app.use((req, res) => {
//     return res.status(404).send({ message: 'Route' + req.url + ' Not found.' })
// })
// // 500 - Any server error
// app.use((req, res) => {
//     return res.status(404).send({ message: 'Route' + req.url + ' Not found.' })
// })
app.use(express.static(path.join(__dirname, 'build')))

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// 500 - Any server error
app.use((err, req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const server = http.createServer(app);
global.io = socketIo(server,{ cors: {origin: '*'}});
io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen( process.env.HOST_PORT, () => {
    console.log('Server start');
    tokenDelete.start();
    websocket.start();
})
