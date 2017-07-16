module.exports = (function () {
    "use strict";

    var _ = require("lodash");
    var path = require('path');
    var Fawn = require("fawn");
    var fs = require("fs-extra");
    var jwt = require("../services/jwt");
    var utils = require("../utils/utils");
    var await = require("asyncawait/await");
    var constants = require("../constants");

    
    var Song = require("../models/song");
    var Album = require("../models/album");
    var Artist = require("../models/artist");

    var ArtistController = {};
    ArtistController.getArtistList = getArtistList;
    ArtistController.getArtist = getArtist;
    ArtistController.saveArtist = saveArtist;
    ArtistController.updateArtist = updateArtist;
    ArtistController.deleteArtist = deleteArtist;

    ArtistController.updateImage = updateImage;
    ArtistController.getImage = getImage;

    return utils.preprocessAllHandlers(ArtistController);

    function getArtistList(request, response) {
        var result = {payload: {}};
        var page = request.params.page ? request.params.page : 1;
        var itemsPerPage = 5;
        var query = {};
        var options = {
            page: page,
            limit: itemsPerPage,
            sort: {name: -1}
        };

        var startRange = itemsPerPage * (page - 1);
        var finishRange = startRange + itemsPerPage;

        var artists = await(Artist.paginate(query, options));

        if(artists.total < startRange){
            result.status = 416;
            result.payload.message = "Requested page not found";
            response.header("Content-Range", "resources */"+artists.total);
        }
        else{
            result.status = 206;
            result.payload.message = "Artists list loaded successfully";
            result.payload.artists = artists.docs;
            finishRange = finishRange < artists.total ? finishRange : artists.total;
            response.header("Content-Range", "resources "+startRange+"-"+finishRange+"/"+artists.total);
        }

        return result;
    }

    function getArtist(request) {
        var result = {payload: {}};
        var artistID = request.params.id;

        request.checkParams("id", "Parameter 'id' is required").notEmpty();

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()){
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        var artist = await(Artist.findById(artistID));

        if(!artist){
            result.status = 404;
            result.payload.message = "Artist not found";
        }
        else{
            result.status = 200;
            result.payload.message = "Artist loaded successfully";
            result.payload.artist = artist
        }

        return result;
    }

    function saveArtist(request) {
        var artist = new Artist();
        var params = request.body;
        var result = {payload: {}};

        request.checkBody("name", "Parameter 'name' is required").notEmpty();
        request.checkBody("description", "Parameter 'description' is required").notEmpty();

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()){
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        artist.name = params.name;
        artist.description = params.description;
        artist.image = "null";

        var artistStored = await(artist.save());

        if(_.isUndefined(artistStored)){
            result.status = 500;
            result.payload.message = "Unable to save artist data";
            return result;
        }

        result.status = 200;
        result.payload.message = "Artist saved successfully";
        result.payload.artist = artist;
        return result;
    }

    function updateArtist(request) {
        var result = {payload: {}};
        var params = request.body;
        var artistID = request.params.id;

        if(_.isEmpty(params)){
            result.status = 400;
            result.payload.message = "Invalid request";
            result.payload.error = "Empty payload";
            return result;
        }

        var artist = await(Artist.findByIdAndUpdate(artistID, params));

        if(!artist){
            result.status = 404;
            result.payload.message = "Artist not found";
        }
        else{
            result.status = 200;
            result.payload.message = "Artist updated successfully";
        }

        return result;
    }

    function deleteArtist(request) {
        var result = {payload: {}};
        var task = Fawn.Task();
        var artistID = request.params.id;

        request.checkParams("id", "Parameter 'id' is required").notEmpty();

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()){
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        var artist = await(Artist.findById(artistID));
        var albums = await(Album.find({artist: artistID}));
        var albumsID = _.map(albums, _.property("_id"));
        var songs = await(Song.find({album:{$in: albumsID}}));

        task.remove(artist);
        _.each(albums, task.remove);
        _.each(songs, task.remove);

        await(task.run());

        result.status = 200;
        result.payload.message = "Artist deleted successfully";

        return result;
    }

    function updateImage(request) {
        var result = {payload: {}};
        var files = request.files;
        var artistID = request.params.id;
        var filePath, fileName, fileExtension, artist;

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

        artist = await(Artist.findByIdAndUpdate(artistID, {image: fileName}));

        if(!artist){
            result.status = 404;
            result.payload.message = "Artist not found";
        }
        else{
            result.status = 200;
            result.payload.message = "Artist updated successfully";
        }

        fs.remove(constants.ARTIST_UPLOAD_DIR + artist.image).catch(function (error) {
            console.log("Unable to remove old profile image of artist "+artist._id, error);
        });

        return result;
    }

    function getImage(request, response) {
        var result = {payload: {}};
        var imageFile = request.params.imageFile;

        request.checkParams("imageFile", "Parameter 'imageFile' is required").notEmpty();

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()) {
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        var imagePath = path.resolve(constants.ARTIST_UPLOAD_DIR + imageFile);
        var image = await(fs.exists(imagePath));

        if (!image) {
            result.status = 404;
            result.payload.message = "Image not found";
        }

        response.status(200);
        response.sendFile(imagePath);
    }
})();
