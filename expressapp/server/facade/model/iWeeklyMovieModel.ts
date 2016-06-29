/// <reference path="../../../../typings/tsd.d.ts" />
import mongoose = require('mongoose');

interface iWeeklyMovie {
    updatedAt?: Date;
    firstDayOfWeek: Date;
	lastDayOfWeek: Date;
	movieIds: Array<String>
}

interface iWeeklyMovieModel extends iWeeklyMovie, mongoose.Document {
}

export = iWeeklyMovieModel