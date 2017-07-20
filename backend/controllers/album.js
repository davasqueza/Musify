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
    var Album = require("../models/album");

    var AlbumController = {};
    AlbumController.getAlbumList = getAlbumList;
    AlbumController.getAlbum = getAlbum;
    AlbumController.saveAlbum = saveAlbum;
    AlbumController.updateAlbum = updateAlbum;
    AlbumController.deleteAlbum = deleteAlbum;

    AlbumController.updateImage = updateImage;
    AlbumController.getImage = getImage;

    return utils.preprocessAllHandlers(AlbumController);

    function getAlbumList(request, response) {
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

        var albums = await(Album.paginate(query, options));

        if(albums.total < startRange){
            result.status = 416;
            result.payload.message = "Requested page not found";
            response.header("Content-Range", "resources */"+albums.total);
        }
        else{
            result.status = 206;
            result.payload.message = "Albums list loaded successfully";
            result.payload.albums = albums.docs;
            finishRange = finishRange < albums.total ? finishRange : albums.total;
            response.header("Content-Range", "resources "+startRange+"-"+finishRange+"/"+albums.total);
        }

        return result;
    }

    function getAlbum(request) {
        var result = {payload: {}};
        var albumID = request.params.id;

        request.checkParams("id", "Parameter 'id' is required").notEmpty();

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()){
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        var album = await(Album.findById(albumID));

        if(!album){
            result.status = 404;
            result.payload.message = "Album not found";
        }
        else{
            result.status = 200;
            result.payload.message = "Album loaded successfully";
            result.payload.album = album
        }

        return result;
    }

    function saveAlbum(request) {
        var album = new Album();
        var params = request.body;
        var result = {payload: {}};

        request.checkBody("title", "Parameter 'name' is required").notEmpty();
        request.checkBody("description", "Parameter 'description' is required").notEmpty();
        request.checkBody("year", "Parameter 'year' must be an integer").isInt();
        request.checkBody("artist", "Parameter 'artist' is required").notEmpty();

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()){
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        album.description = params.description;
        album.year = params.year;
        album.artist = params.artist;
        album.image = "null";

        var albumStored = await(album.save());

        if(_.isUndefined(albumStored)){
            result.status = 500;
            result.payload.message = "Unable to save album data";
            return result;
        }

        result.status = 200;
        result.payload.message = "Album saved successfully";
        result.payload.album = album;
        return result;
    }

    function updateAlbum(request) {
        var result = {payload: {}};
        var params = request.body;
        var albumID = request.params.id;

        if(_.isEmpty(params)){
            result.status = 400;
            result.payload.message = "Invalid request";
            result.payload.error = "Empty payload";
            return result;
        }

        var album = await(Album.findByIdAndUpdate(albumID, params));

        if(!album){
            result.status = 404;
            result.payload.message = "Album not found";
        }
        else{
            result.status = 200;
            result.payload.message = "Album updated successfully";
        }

        return result;
    }

    function deleteAlbum(request) {
        var result = {payload: {}};
        var task = Fawn.Task();
        var albumID = request.params.id;

        request.checkParams("id", "Parameter 'id' is required").notEmpty();

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()){
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        var album = await(Album.findById(albumID));
        var songs = await(Song.find({album: albumID}));

        task.remove(album);
        _.each(songs, task.remove);

        await(task.run());

        result.status = 200;
        result.payload.message = "Album deleted successfully";

        return result;
    }

    function updateImage(request) {
        var result = {payload: {}};
        var files = request.files;
        var albumID = request.params.id;
        var filePath, fileName, fileExtension, album;

        request.checkParams("id", "Parameter 'id' is required").notEmpty();

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()){
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        if(_.isEmpty(files) || _.isUndefined(files.image)){
            result.status = 400;
            result.payload.message = "File 'image' is required";
            return result;
        }

        filePath = files.image.path;
        fileExtension = path.extname(filePath);
        fileName = path.basename(filePath);
        var acceptedFormats = [".jpg", ".png", ".gif"];

        if(_.indexOf(acceptedFormats, fileExtension) === -1){
            result.status = 415;
            result.payload.message = "Extension '"+fileExtension+"' is currently not supported by the server";
            return result;
        }

        album = await(Album.findByIdAndUpdate(albumID, {image: fileName}));

        if(!album){
            result.status = 404;
            result.payload.message = "Album not found";
        }
        else{
            result.status = 200;
            result.payload.message = "Album updated successfully";
        }

        fs.remove(constants.ALBUM_UPLOAD_DIR + album.image).catch(function (error) {
            console.log("Unable to remove old profile image of album "+album._id, error);
        });

        return result;
    }

    function getImage(request, response) {
        var imageFile = request.params.imageFile;

        request.checkParams("imageFile", "Parameter 'imageFile' is required").notEmpty();

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()) {
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        var imagePath = path.resolve(constants.ALBUM_UPLOAD_DIR + imageFile);

        fs.access(imagePath)
            .then(function () {
                response.status(200);
                response.sendFile(imagePath);
            })
            .catch(function () {
                response.status(404);
                response.send({message: "Image not found"});
            });
    }
})();
