(function () {
    "use strict";

    var bluebird = require('bluebird');
    var mongoose = require("mongoose");
    var app = require("./app");
    var APIPort = process.env.APIPORT || 3977;
    var DBPort = process.env.DBPort || 27017;

    mongoose.Promise = bluebird;


    function connectToDatabase() {
        var connectionOptions = {useMongoClient: true};

        var databaseConnection = mongoose.connect("mongodb://localhost:"+DBPort+"/musify", connectionOptions);

        databaseConnection.then(function () {
            console.log("Database connection successfully");
            listenConnections();
        });

        databaseConnection.catch(function () {
            console.log("Unable to connect to database:");
        });
    }

    function listenConnections() {
        app.listen(APIPort, function () {
            console.log("Musify server initialized successfully, awaiting connections on http://localhost:"+APIPort);
        });
    }

    connectToDatabase();
})();