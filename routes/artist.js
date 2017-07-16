module.exports = (function () {
    "use strict";

    var express = require("express");
    var constants = require("../constants");
    var multipart = require("connect-multiparty");
    var ArtistController = require("../controllers/artist");
    var AuthenticatedMiddleware = require("../middlewares/authenticated").ensureAuth;
    var UploadMiddleware = multipart({uploadDir: constants.ARTIST_UPLOAD_DIR});

    var api = express.Router();

    api.get("/artists/:page", AuthenticatedMiddleware, ArtistController.getArtistList);
    api.get("/artist/:id", AuthenticatedMiddleware, ArtistController.getArtist);
    api.post("/artist", AuthenticatedMiddleware, ArtistController.saveArtist);
    api.put("/artist/:id", AuthenticatedMiddleware, ArtistController.updateArtist);
    api.delete("/artist/:id", AuthenticatedMiddleware, ArtistController.deleteArtist);
    api.post("/uploadArtistImage/:id", [AuthenticatedMiddleware, UploadMiddleware], ArtistController.updateImage);
    api.get("/getArtistImage/:imageFile", ArtistController.getImage);

    return api;
})();

