(function () {
    "use strict";

    var bluebird = require('bluebird');
    var mongoose = require("mongoose");
    var fs = require("fs-extra");
    var app = require("./app");
    var constants = require("./constants");

    mongoose.Promise = bluebird;


    function connectToDatabase() {
        var connectionOptions = {useMongoClient: true};

        var databaseConnection = mongoose.connect("mongodb://localhost:"+constants.DB_PORT+"/musify", connectionOptions);

        databaseConnection.then(function () {
            console.log("Database connection successfully");
            ensureUploadFolders();
            listenConnections();
        });

        databaseConnection.catch(function () {
            console.log("Unable to connect to database:");
        });
    }

    function ensureUploadFolders() {
        fs.ensureDirSync(constants.USER_UPLOAD_DIR);
    }

    function listenConnections() {
        app.listen(constants.API_PORT, function () {
            console.log("Musify server initialized successfully, awaiting connections on http://localhost:"+constants.API_PORT);
        });
    }

    connectToDatabase();
})();