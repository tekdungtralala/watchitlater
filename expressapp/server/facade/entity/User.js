"use strict";
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    lastLogin: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        trim: true
    },
    socialNetwok: {
        id: {
            type: String,
            trim: true
        },
        fullName: {
            type: String,
            trim: true
        },
        imageUrl: {
            type: String,
            trim: true
        },
        type: {
            type: String,
            trim: true
        }
    }
});
var User = mongoose.model('User', UserSchema);
module.exports = User;
