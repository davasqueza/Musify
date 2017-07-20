module.exports = (function () {
    "use strict";

    var express = require("express");
    var constants = require("../constants");
    var multipart = require("connect-multiparty");
    var SongController = require("../controllers/song");
    var AuthenticatedMiddleware = require("../middlewares/authenticated").ensureAuth;
    var UploadMiddleware = multipart({uploadDir: constants.SONG_UPLOAD_DIR});

    var api = express.Router();

    api.get("/songs/:page", AuthenticatedMiddleware, SongController.getSongList);
    api.get("/song/:id", AuthenticatedMiddleware, SongController.getSong);
    api.post("/song", AuthenticatedMiddleware, SongController.saveSong);
    api.put("/song/:id", AuthenticatedMiddleware, SongController.updateSong);
    api.delete("/song/:id", AuthenticatedMiddleware, SongController.deleteSong);
    api.post("/uploadSongFile/:id", [AuthenticatedMiddleware, UploadMiddleware], SongController.updateFile);
    api.get("/getSongFile/:fileFile", SongController.getFile);

    return api;
})();

