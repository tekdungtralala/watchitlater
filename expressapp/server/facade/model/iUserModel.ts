/// <reference path="../../../../typings/tsd.d.ts" />
import mongoose = require('mongoose');

interface iUser {
    lastLogin: Date;
    email: string;
    socialNetwork: {
		id: string
		fullName: string
		imageUrl: string
		type: string
	}
}

interface iUserModel extends iUser, mongoose.Document {
}

export = iUserModel