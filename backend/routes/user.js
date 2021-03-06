module.exports = (function () {
    "use strict";

    var express = require("express");
    var constants = require("../constants");
    var multipart = require("connect-multiparty");
    var UserController = require("../controllers/user");
    var AuthenticatedMiddleware = require("../middlewares/authenticated").ensureAuth;
    var UploadMiddleware = multipart({uploadDir: constants.USER_UPLOAD_DIR});

    var api = express.Router();

    api.post("/saveUser", UserController.saveUser);
    api.post("/login", UserController.loginUser);
    api.put("/updateUser/:id", AuthenticatedMiddleware, UserController.updateUser);
    api.post("/uploadUserImage/:id", [AuthenticatedMiddleware, UploadMiddleware], UserController.updateImage);
    api.get("/getUserImage/:imageFile", UserController.getImage);

    return api;
})();

