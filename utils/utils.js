module.exports = (function () {
    "use strict";

    var async = require("asyncawait/async");

    var utils = {};
    utils.processRequest = processRequest;

    return utils;

    function processRequest(handler) {
        return function (request, response) {
            var procededRequest = async(handler)(request, response);

            procededRequest.then(function (result) {
                response.status(result.status);
                response.send(result.payload);
            });

            procededRequest.catch(function (error) {
                response.status(500);
                response.send({message: "Unable to process your request", error: error});

            });
        };
    }
})();