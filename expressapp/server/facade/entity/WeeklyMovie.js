"use strict";
var mongoose = require('mongoose');
var WeeklyMovieSchema = new mongoose.Schema({
    updatedAt: {
        type: Date,
        required: true
    },
    firstDayOfWeek: {
        type: Date,
        required: true
    },
    lastDayOfWeek: {
        type: Date,
        required: true
    },
    movieIds: {
        type: Array,
        trim: true,
        required: true
    }
});
var WeeklyMovie = mongoose.model('WeeklyMovie', WeeklyMovieSchema);
module.exports = WeeklyMovie;
