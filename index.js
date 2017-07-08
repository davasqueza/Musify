(function () {
    "use strict";
    
    var bluebird = require('bluebird');
    var mongoose = require("mongoose");

    mongoose.Promise = bluebird;

    
    function connectToDatabase() {
        var connectionOptions = {useMongoClient: true};

        var databaseConnection = mongoose.connect("mongodb://localhost:27017/musify", connectionOptions);

        databaseConnection.then(function () {
            console.log("Connection successfully");
        });

        databaseConnection.catch(function () {
            console.log("Unable to connect to database");
        });
    }

    connectToDatabase();
})();