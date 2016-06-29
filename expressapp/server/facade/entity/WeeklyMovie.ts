/// <reference path="../../../../typings/tsd.d.ts" />
import mongoose = require('mongoose');
import iWeeklyMovieModel = require('../model/iWeeklyMovieModel')

let WeeklyMovieSchema: mongoose.Schema = new mongoose.Schema({
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

let WeeklyMovie: mongoose.Model<iWeeklyMovieModel> = mongoose.model<iWeeklyMovieModel>('WeeklyMovie', WeeklyMovieSchema);

export = WeeklyMovie