module.exports = (function () {
    "use strict";

    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var AlbumSchema = Schema({
        title: String,
        description: String,
        year: Number,
        image: String,
        artist: {
            type: Schema.ObjectId,
            ref: "Artist"
        }
    });

    return mongoose.model("Album", AlbumSchema);
})();
