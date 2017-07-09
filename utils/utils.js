module.exports = (function () {
    "use strict";

    var async = require("asyncawait/async");
    var _ = require("lodash");

    var utils = {};
    utils.processRequest = processRequest;
    utils.preprocessAllHandlers = preprocessAllHandlers;
    utils.buildInvalidRequestResponse = buildInvalidRequestResponse;

    return utils;

    function processRequest(handler) {
        return function (request, response, next) {
            var procededRequest = async(handler)(request, response, next);

            procededRequest.then(function (result) {
                if(result){
                    response.status(result.status);
                    response.send(result.payload);
                }
            });

            procededRequest.catch(function (error) {
                response.status(500);
                response.send({message: "Unable to process your request", error: error.name + ": " + error.message});

            });
        };
    }

    function buildInvalidRequestResponse(validationsResult) {
        var result = {payload: {}};
        result.status = 400;
        result.payload.message = "Invalid request";
        result.payload.error = validationsResult.array();
        return result;
    }

    function preprocessAllHandlers(handlers) {
        return _.mapValues(handlers, processRequest);
    }
})();