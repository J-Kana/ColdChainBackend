const { authJwt,verifySignUp } = require("../../middleware");
const controller = require("../../controllers/V1/firebase_token.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/rest/v1/firebase_token/objectCreate",
        [authJwt.verifyToken],
        controller.objectCreate
    );
};
