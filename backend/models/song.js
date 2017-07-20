module.exports = (function () {
    "use strict";

    var mongoose = require("mongoose");
    var mongoosePaginate = require("mongoose-paginate");
    var Schema = mongoose.Schema;

    var SongSchema = Schema({
        number: String,
        name: String,
        duration: String,
        file: String,
        album: {
            type: Schema.ObjectId,
            ref: "album"
        }
    });

    SongSchema.plugin(mongoosePaginate);

    return mongoose.model("Song", SongSchema);
})();

