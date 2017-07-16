module.exports = (function () {
    "use strict";

    var express = require("express");
    var bodyParser = require("body-parser");
    var expressValidator = require("express-validator");

    var app = express();

    //Middleware
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(expressValidator());

    //HTTP headers

    //Application routes
    var UserRoutes = require("./routes/user");
    var ArtistRoutes = require("./routes/artist");
    var AlbumRoutes = require("./routes/album");

    app.use("/api", UserRoutes);
    app.use("/api", ArtistRoutes);
    app.use("/api", AlbumRoutes);

    return app;
})();
