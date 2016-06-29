/// <reference path="../../../../typings/tsd.d.ts" />
import mongoose = require('mongoose');

interface iBookmark {
    updatedAt: Date;
    userId: string;
    movieId: string;
	status: string
}

interface iBookmarkModel extends iBookmark, mongoose.Document {
}

export = iBookmarkModel