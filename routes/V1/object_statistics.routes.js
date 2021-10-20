const { authJwt,verifySignUp } = require("../../middleware");
const controller = require("../../controllers/V1/object_statistics.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/rest/v1/object_statistics/getObject",
        [authJwt.verifyToken],
        controller.getObject
    );

    app.post("/api/rest/v1/object_statistics/objectCreate",
        [authJwt.verifyToken, authJwt.checkUserCompany, authJwt.isSuperAdminOrAdmin],
        controller.objectCreate
    );

    app.put("/api/rest/v1/object_statistics/objectUpdate/:id",
        [authJwt.verifyToken, authJwt.checkUserCompany, authJwt.isSuperAdminOrAdmin],
        controller.objectUpdate
    );

    app.delete("/api/rest/v1/object_statistics/objectDelete/:id",
        [authJwt.verifyToken, authJwt.checkUserCompany, authJwt.isSuperAdminOrAdmin],
        controller.objectDelete
    );
};
