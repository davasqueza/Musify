module.exports = (function () {
    "use strict";

    var await = require("asyncawait/await");
    var bluebird = require("bluebird");
    var bcript = bluebird.promisifyAll(require("bcrypt-nodejs"));
    var _ = require("lodash");
    var User = bluebird.promisifyAll(require("../models/user"));
    var jwt = require("../services/jwt");

    var UserController = {};
    UserController.saveUser = saveUser;
    UserController.loginUser = loginUser;

    return UserController;

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
            result.status = 400;
            result.payload.message = "Invalid request";
            result.payload.error = validationsResult.array();
            return result;
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
            result.status = 400;
            result.payload.message = "Invalid request";
            result.payload.error = validationsResult.array();
            return result;
        }

        var user = await(User.findOneAsync({email: params.email}));

        if(!user){
            result.status = 404;
            result.payload.message = "User not found";
            return result;
        }

        var passwordMatch = await(bcript.compareAsync(params.password, user.password));

        if(passwordMatch){
            result.status = 200;
            result.payload.message = "Login successful";
            result.payload.user = _.pick(user, ["name", "surname", "email", "role", "image"]);
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

})();
