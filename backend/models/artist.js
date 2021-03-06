module.exports = (function () {
    "use strict";

    var mongoose = require("mongoose");
    var mongoosePaginate = require('mongoose-paginate');
    var Schema = mongoose.Schema;

    var ArtistSchema = Schema({
        name: String,
        description: String,
        image: String
    });

    ArtistSchema.plugin(mongoosePaginate);

    return mongoose.model("Artist", ArtistSchema);
})();
