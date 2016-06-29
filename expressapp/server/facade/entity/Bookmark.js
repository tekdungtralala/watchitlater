"use strict";
var mongoose = require('mongoose');
var BookmarkSchema = new mongoose.Schema({
    updatedAt: {
        type: Date,
        required: true
    },
    userId: {
        type: String,
        trim: true,
        required: true
    },
    movieId: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: String,
        trim: true,
        required: true
    }
});
var Bookmark = mongoose.model('Bookmark', BookmarkSchema);
module.exports = Bookmark;
