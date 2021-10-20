const { authJwt,verifySignUp } = require("../../middleware");
const controller = require("../../controllers/V1/user.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/rest/v1/user/getObject/:id?",
        [authJwt.verifyToken],
        controller.getObject
    );

    app.get("/api/rest/v1/user/checkToken",
        [authJwt.verifyToken],
        controller.checkToken
    );

    app.post("/api/rest/v1/user/objectCreate",
        [authJwt.verifyToken, authJwt.checkUserCompany, authJwt.isSuperAdminOrAdmin, verifySignUp.checkDuplicateUsernameOrEmail],
        controller.objectCreate
    );

    app.post("/api/rest/v1/user/objectRegister",
        [verifySignUp.checkDuplicateUsernameOrEmail],
        controller.objectRegister
    );

    app.put("/api/rest/v1/user/objectUpdate/:id",
        [authJwt.verifyToken, authJwt.checkUserCompany, authJwt.isSuperAdminOrAdmin],
        controller.objectUpdate
    );

    app.delete("/api/rest/v1/user/objectDelete/:id",
        [authJwt.verifyToken, authJwt.checkUserCompany, authJwt.isSuperAdminOrAdmin],
        controller.objectDelete
    );

    app.post("/api/rest/v1/user/checkEmail",
        controller.checkEmail
    );

    app.put("/api/rest/v1/user/resetPassword",
        [authJwt.verifyToken],
        controller.resetPassword
    );

    app.get("/api/rest/v1/user/checkUserByToken",
        [authJwt.verifyToken],
        controller.checkUserByToken
    );
};
