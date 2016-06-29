/// <reference path="../../../../typings/tsd.d.ts" />
import mongoose = require('mongoose');
import iBookmarkModel = require('../model/iBookmarkModel')

let BookmarkSchema: mongoose.Schema = new mongoose.Schema({
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
})

let Bookmark: mongoose.Model<iBookmarkModel> = mongoose.model<iBookmarkModel>('Bookmark', BookmarkSchema);

export = Bookmark