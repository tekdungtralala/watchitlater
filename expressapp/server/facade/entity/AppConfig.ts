/// <reference path="../../../../typings/tsd.d.ts" />
import mongoose = require('mongoose');
import iAppConfigModel = require('../model/iAppConfigModel')

let AppConfigSchema: mongoose.Schema = new mongoose.Schema({
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

let AppConfig: mongoose.Model<iAppConfigModel> = mongoose.model<iAppConfigModel>('AppConfig', AppConfigSchema);

export = AppConfig