module.exports = (function () {
    "use strict";

    var express = require("express");
    var constants = require("../constants");
    var multipart = require("connect-multiparty");
    var AlbumController = require("../controllers/album");
    var AuthenticatedMiddleware = require("../middlewares/authenticated").ensureAuth;
    var UploadMiddleware = multipart({uploadDir: constants.ALBUM_UPLOAD_DIR});

    var api = express.Router();

    api.get("/albums/:page", AuthenticatedMiddleware, AlbumController.getAlbumList);
    api.get("/album/:id", AuthenticatedMiddleware, AlbumController.getAlbum);
    api.post("/album", AuthenticatedMiddleware, AlbumController.saveAlbum);
    api.put("/album/:id", AuthenticatedMiddleware, AlbumController.updateAlbum);
    api.delete("/album/:id", AuthenticatedMiddleware, AlbumController.deleteAlbum);
    api.post("/uploadAlbumImage/:id", [AuthenticatedMiddleware, UploadMiddleware], AlbumController.updateImage);
    api.get("/getAlbumImage/:imageFile", AlbumController.getImage);

    return api;
})();

