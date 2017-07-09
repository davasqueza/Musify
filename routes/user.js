module.exports = (function () {
    "use strict";

    var express = require("express");
    var AuthenticatedMiddleware = require("../middlewares/authenticated");
    var UserController = require("../controllers/user");

    var api = express.Router();

    api.post("/saveUser", UserController.saveUser);
    api.post("/updateUser/:id", AuthenticatedMiddleware.ensureAuth, UserController.updateUser);
    api.post("/login", UserController.loginUser);

    return api;
})();

