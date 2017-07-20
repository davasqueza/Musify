module.exports = (function () {
    "use strict";

    var jwt = require("jwt-simple");
    var moment = require("moment");
    var utils = require("../utils/utils");
    var await = require("asyncawait/await");

    var secret = "musify&2017";

    var AuthenticatedMiddleware = {};
    AuthenticatedMiddleware.ensureAuth = ensureAuth;

    return utils.preprocessAllHandlers(AuthenticatedMiddleware);

    function ensureAuth(request, response, next) {
        var result = {payload: {}};
        var token, userData;

        request.checkHeaders("authorization", "authorization header is required").notEmpty();

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()){
            result.status = 401;
            result.payload.message = "No authorized";
            result.payload.error = validationsResult.array();
            return result;
        }

        token = request.headers.authorization;

        try{
            userData = jwt.decode(token, secret);
            if(userData.exp <= moment().unix()){
                result.status = 401;
                result.payload.message = "Expired token";
                return result;
            }
        }
        catch(error){
            result.status = 401;
            result.payload.message = "Invalid token";

            console.log("Detected attempt to login with an invalid token:" +token, error);
            return result;
        }

        request.user = userData;

        next();
    }
})();
