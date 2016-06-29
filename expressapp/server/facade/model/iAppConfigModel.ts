/// <reference path="../../../../typings/tsd.d.ts" />
import mongoose = require('mongoose');

interface iAppConfig {
    updatedAt: Date;
    key: string;
    value: string[];
}

interface iAppConfigModel extends iAppConfig, mongoose.Document {
}

export = iAppConfigModel