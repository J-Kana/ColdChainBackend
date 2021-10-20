const { authJwt,verifySignUp } = require("../../middleware");
const controller = require("../../controllers/V1/company.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/rest/v1/company/getAllObject",
        [authJwt.verifyToken],
        controller.getAllObject
    );

    app.get("/api/rest/v1/company/getObject/:id",
        [authJwt.verifyToken],
        controller.getObject
    );

    app.post("/api/rest/v1/company/objectCreate",
        [authJwt.verifyToken, authJwt.checkUserCompany, authJwt.isSuperAdmin],
        controller.objectCreate
    );

    app.post("/api/rest/v1/company/objectRegister",
        // [authJwt.verifyToken, authJwt.isSuperAdmin],
        [verifySignUp.checkDuplicateCompanyUsernameAndEmail],
        controller.objectRegister
    );

    app.put("/api/rest/v1/company/objectUpdate/:id",
        [authJwt.verifyToken, authJwt.checkUserCompany, authJwt.isSuperAdmin],
        controller.objectUpdate
    );

    app.delete("/api/rest/v1/company/objectDelete/:id",
        [authJwt.verifyToken, authJwt.checkUserCompany, authJwt.isSuperAdmin],
        controller.objectDelete
    );
};
