module.exports = (function () {
    "use strict";

    var _ = require("lodash");
    var path = require('path');
    var fs = require("fs-extra");
    var bluebird = require("bluebird");
    var jwt = require("../services/jwt");
    var utils = require("../utils/utils");
    var await = require("asyncawait/await");
    var constanst = require("../constants");
    var User = require("../models/user");
    var bcript = bluebird.promisifyAll(require("bcrypt-nodejs"));

    var UserController = {};
    UserController.saveUser = saveUser;
    UserController.loginUser = loginUser;
    UserController.updateUser = updateUser;
    UserController.updateImage = updateImage;
    UserController.getImage = getImage;

    return utils.preprocessAllHandlers(UserController);

    function saveUser(request) {
        var user = new User();
        var params = request.body;
        var result = {payload: {}};

        request.checkBody("name", "Parameter 'name' is required").notEmpty();
        request.checkBody("surname", "Parameter 'surname' is required").notEmpty();
        request.checkBody("email", "Parameter 'email' is required").notEmpty()
            .isEmail().withMessage("Parameter 'email' must have a valid format");

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()){
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = "ROLE_USER";
        user.image = "null";

        if(params.password){
            user.password = await(bcript.hashAsync(params.password, null, null));
            var userStored = await(user.save());
        }

        if(_.isUndefined(userStored)){
            result.status = 500;
            result.payload.message = "Unable to save user data";
            return result;
        }

        result.status = 200;
        result.payload.message = "User saved successfully";
        result.payload.user = user;
        return result;
    }

    function loginUser(request) {
        var result = {payload: {}};

        request.checkBody("email", "Parameter 'email' is required").notEmpty()
            .isEmail().withMessage("Parameter 'email' must have a valid format");
        request.checkBody("password", "Parameter 'password' is required").notEmpty();
        request.sanitizeBody('getHash').toBoolean();

        var params = request.body;

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()){
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        var user = await(User.findOne({email: params.email}));

        if(!user){
            result.status = 404;
            result.payload.message = "User not found";
            return result;
        }

        var passwordMatch = await(bcript.compareAsync(params.password, user.password));

        if(passwordMatch){
            result.status = 200;
            result.payload.message = "Login successful";
            result.payload.user = _.pick(user, ["_id", "name", "surname", "email", "role", "image"]);
            if(params.getHash){
                result.payload.token = jwt.createToken(user);
            }
            return result;
        }
        else{
            result.status = 401;
            result.payload.message = "Wrong password";
            return result;
        }
    }

    function updateUser(request) {
        var result = {payload: {}};
        var params = request.body;
        var userID = request.params.id;

        if(_.isEmpty(params)){
            result.status = 400;
            result.payload.message = "Invalid request";
            result.payload.error = "Empty payload";
            return result;
        }

        request.checkBody("email", "Parameter 'email' must have a valid format").optional().isEmail();
        request.checkParams("id", "Parameter 'id' is required").notEmpty();

        var validationsResult = await(request.getValidationResult());

        if (!validationsResult.isEmpty()){
            return utils.buildInvalidRequestResponse(validationsResult);
        }

        var user = await(User.findByIdAndUpdate(userID, params));

        if(!user){
            result.status = 404;
            result.payload.message = "User not found";
        }
        else{
            result.status = 200;
            result.payload.message = "User updated successfully";
        }

        return result;
    }

    function updateImage(request) {
        var result = {payload: {}};
        var files = request.files;
        var userID = request.params.id;
        var filePath, fileName, fileExtension, user;

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

        user = await(User.findByIdAndUpdate(userID, {image: fileName}));

        if(!user){
            result.status = 404;
            result.payload.message = "User not found";
        }
        else{
            result.status = 200;
            result.payload.image = fileName;
            result.payload.message = "User updated successfully";
        }

        fs.remove(constanst.USER_UPLOAD_DIR + user.image).catch(function (error) {
            console.log("Unable to remove old profile image of user "+user._id, error);
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

        var imagePath = path.resolve(constanst.USER_UPLOAD_DIR + imageFile);
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
