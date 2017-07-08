module.exports = (function () {
    "use strict";

    var express = require("express");
    var bodyParser = require("body-parser");

    var app = express();

    //Middleware
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    //HTTP headers

    //Application routes

    return app;
})();
