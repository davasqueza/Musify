module.exports = (function () {
    "use strict";

    var jwt = require("jwt-simple");
    var moment = require("moment");
    var secret = "musify&2017";

    var JWTService = {};
    JWTService.createToken = createToken;

    return JWTService;

    function createToken(user) {
        var payload = {};

        payload.sub = user._id;
        payload.name = user.name;
        payload.surname = user.surname;
        payload.email = user.email;
        payload.role = user.role;
        payload.image = user.image;
        payload.iat = moment().unix();
        payload.exp = moment().add(30, "days").unix;

        return jwt.encode(payload, secret);
    }
})();

