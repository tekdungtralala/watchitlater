"use strict";
var mongoose = require('mongoose');
var AppConfigSchema = new mongoose.Schema({
    updatedAt: {
        type: Date,
        required: true
    },
    key: {
        type: String,
        trim: true,
        required: true
    },
    value: {
        type: Array,
        trim: true,
        required: true
    }
});
var AppConfig = mongoose.model('AppConfig', AppConfigSchema);
module.exports = AppConfig;
