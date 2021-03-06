module.exports = (function () {
    "use strict";

    var express = require("express");
    var bodyParser = require("body-parser");
    var expressValidator = require("express-validator");
    var cors = require("cors");

    var app = express();

    //Middleware
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(expressValidator());
    app.use(cors());

    //HTTP OPTIONS configuration
    app.options('*', cors());


    //Application routes
    var UserRoutes = require("./routes/user");
    var ArtistRoutes = require("./routes/artist");
    var AlbumRoutes = require("./routes/album");
    var SongRoutes = require("./routes/song");

    app.use("/api", UserRoutes);
    app.use("/api", ArtistRoutes);
    app.use("/api", AlbumRoutes);
    app.use("/api", SongRoutes);

    return app;
})();
