/// <reference path="../../../../typings/tsd.d.ts" />
import mongoose = require('mongoose');
import iUserModel = require('../model/iUserModel')

let UserSchema: mongoose.Schema = new mongoose.Schema({
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

let User: mongoose.Model<iUserModel> = mongoose.model<iUserModel>('User', UserSchema);

export = User