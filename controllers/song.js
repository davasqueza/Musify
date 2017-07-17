module.exports = (function () {
    "use strict";

    var _ = require("lodash");
    var path = require('path');
    var Fawn = require("fawn");
    var fs = require("fs-extra");
    var utils = require("../utils/utils");
    var await = require("asyncawait/await");
    var constants = require("../constants");

    
    var Song = require("../models/song");

    var SongController = {};
    SongController.getSongList = getSongList;
    SongController.getSong = getSong;
    SongController.saveSong = saveSong;
    SongController.updateSong = updateSong;
    SongController.deleteSong = deleteSong;

    SongController.updateFile = updateFile;
    SongController.getFile = getFile;

    return utils.preprocessAllHandlers(SongController);

    function getSongList(request, response) {
        var result = {payload: {}};
        var page = request.params.page ? request.params.page : 1;
        var itemsPerPage = 5;
        var query = {};
        var options = {
            page: page,
            limit: itemsPerPage,
            sort: {title: -1}
        };

        var startRange = itemsPerPage * (page - 1);
        var finishRange = startRange + itemsPerPage;

        var songs = await(Song.paginate(query, options));

        if(songs.total < startRange){
            result.status = 416;
            result.payload.message = "Requested page not found";
            response.header("Content-Range", "resources */"+songs.total);
        }
        else{
            result.status = 206;
            result.payload.message = "Songs list loaded successfully";
            result.payload.songs = songs.docs;
            finishRange = finishRange < songs.total ? finishRange : songs.total;
            response.header("Content-Range", "resources "+startRange+"-"+finishRange+"/"+songs.total);
        }

        return result;
    }

    function getSong(request) {
        var result = {payload: {}};
        var songID = request.params.id;

        request.checkParams("id", "Parameter 'id' is required").notEmpty();

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()){
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        var song = await(Song.findById(songID));

        if(!song){
            result.status = 404;
            result.payload.message = "Song not found";
        }
        else{
            result.status = 200;
            result.payload.message = "Song loaded successfully";
            result.payload.song = song
        }

        return result;
    }

    function saveSong(request) {
        var song = new Song();
        var params = request.body;
        var result = {payload: {}};

        request.checkBody("number", "Parameter 'number' must be an integer").isInt();
        request.checkBody("name", "Parameter 'name' is required").notEmpty();
        request.checkBody("duration", "Parameter 'duration' is required").notEmpty();
        request.checkBody("album", "Parameter 'album' is required").notEmpty();

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()){
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        song.number = params.number;
        song.name = params.name;
        song.duration = params.duration;
        song.album = params.album;
        song.file = "null";

        var songStored = await(song.save());

        if(_.isUndefined(songStored)){
            result.status = 500;
            result.payload.message = "Unable to save song data";
            return result;
        }

        result.status = 200;
        result.payload.message = "Song saved successfully";
        result.payload.song = song;
        return result;
    }

    function updateSong(request) {
        var result = {payload: {}};
        var params = request.body;
        var songID = request.params.id;

        if(_.isEmpty(params)){
            result.status = 400;
            result.payload.message = "Invalid request";
            result.payload.error = "Empty payload";
            return result;
        }

        var song = await(Song.findByIdAndUpdate(songID, params));

        if(!song){
            result.status = 404;
            result.payload.message = "Song not found";
        }
        else{
            result.status = 200;
            result.payload.message = "Song updated successfully";
        }

        return result;
    }

    function deleteSong(request) {
        var result = {payload: {}};
        var task = Fawn.Task();
        var songID = request.params.id;

        request.checkParams("id", "Parameter 'id' is required").notEmpty();

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()){
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        var song = await(Song.findById(songID));

        task.remove(song);

        await(task.run());

        result.status = 200;
        result.payload.message = "Song deleted successfully";

        return result;
    }

    function updateFile(request) {
        var result = {payload: {}};
        var files = request.files;
        var songID = request.params.id;
        var filePath, fileName, fileExtension, song;

        request.checkParams("id", "Parameter 'id' is required").notEmpty();

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()){
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        if(_.isEmpty(files) || _.isUndefined(files.file)){
            result.status = 400;
            result.payload.message = "File 'file' is required";
            return result;
        }

        filePath = files.file.path;
        fileExtension = path.extname(filePath);
        fileName = path.basename(filePath);
        var acceptedFormats = [".mp3", ".wav"];

        if(_.indexOf(acceptedFormats, fileExtension) === -1){
            result.status = 415;
            result.payload.message = "Extension '"+fileExtension+"' is currently not supported by the server";
            return result;
        }

        song = await(Song.findByIdAndUpdate(songID, {file: fileName}));

        if(!song){
            result.status = 404;
            result.payload.message = "Song not found";
        }
        else{
            result.status = 200;
            result.payload.message = "Song updated successfully";
        }

        fs.remove(constants.SONG_UPLOAD_DIR + song.file).catch(function (error) {
            console.log("Unable to remove old profile file of song "+song._id, error);
        });

        return result;
    }

    function getFile(request, response) {
        var fileFile = request.params.fileFile;

        request.checkParams("fileFile", "Parameter 'fileFile' is required").notEmpty();

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()) {
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        var filePath = path.resolve(constants.SONG_UPLOAD_DIR + fileFile);
        fs.access(filePath)
            .then(function () {
                response.status(200);
                response.sendFile(filePath);
            })
            .catch(function () {
                response.status(404);
                response.send({message: "File not found"});
            });
    }
})();
