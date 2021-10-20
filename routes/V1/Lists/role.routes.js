const { authJwt } = require("../../../middleware");
const controller = require("../../../controllers/V1/Lists/role.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/rest/v1/role/getObject/:id?",
        [authJwt.verifyToken],
        controller.getObject
    );

    app.post(
        "/api/rest/v1/role/objectCreate",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectCreate
    );

    app.put(
        "/api/rest/v1/role/objectUpdate/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectUpdate
    );
    app.delete(
        "/api/rest/v1/role/objectDelete/:id",
        [authJwt.verifyToken, authJwt.isSuperAdmin],
        controller.objectDelete
    );
};