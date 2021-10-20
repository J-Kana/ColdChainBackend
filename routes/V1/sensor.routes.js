const { authJwt,verifySignUp } = require("../../middleware");
const controller = require("../../controllers/V1/sensor.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/rest/v1/sensor/getObject/:id?",
        [authJwt.verifyToken],
        controller.getObject
    );

    app.post("/api/rest/v1/sensor/objectCreate",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectCreate
    );

    app.put("/api/rest/v1/sensor/objectUpdate/:id",
        [authJwt.verifyToken, authJwt.checkUserCompany, authJwt.isSuperAdminOrAdmin],
        controller.objectUpdate
    );

    app.delete("/api/rest/v1/sensor/objectDelete/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectDelete
    );
};
