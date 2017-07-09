module.exports = Object.freeze({
    API_PORT: process.env.API_PORT || 3977,
    DB_PORT: process.env.DB_PORT || 27017,
    USER_UPLOAD_DIR: process.env.USER_UPLOAD_DIR || "./uploads/users/"
});