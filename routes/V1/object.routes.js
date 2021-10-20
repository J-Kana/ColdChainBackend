const { authJwt,verifySignUp } = require("../../middleware");
const controller = require("../../controllers/V1/object.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/rest/v1/object/getObject/:id?",
        [authJwt.verifyToken],
        controller.getObject
    );

    app.get("/api/rest/v1/object/getTree/:id?",
        [authJwt.verifyToken],
        controller.getTree
    );

    app.post("/api/rest/v1/object/objectCreate",
        [authJwt.verifyToken, authJwt.checkUserCompany, authJwt.isSuperAdminOrAdmin],
        controller.objectCreate
    );

    app.put("/api/rest/v1/object/objectUpdate/:id",
        [authJwt.verifyToken, authJwt.checkUserCompany, authJwt.isSuperAdminOrAdmin],
        controller.objectUpdate
    );

    app.delete("/api/rest/v1/object/objectDelete/:id",
        [authJwt.verifyToken, authJwt.checkUserCompany, authJwt.isSuperAdminOrAdmin],
        controller.objectDelete
    );
};
