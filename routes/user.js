module.exports = (function () {
    "use strict";

    var express = require("express");
    var utils = require("../utils/utils");
    var UserController = require("../controllers/user");

    var api = express.Router();

    api.post("/saveUser", utils.processRequest(UserController.saveUser));
    api.post("/login", utils.processRequest(UserController.loginUser));

    return api;
})();

