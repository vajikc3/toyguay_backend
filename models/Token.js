'use strict';

let mongoose = require ('mongoose');

// User schema

let tokenSchema = mongoose.Schema({
    platform: {type: String, enum: ['ios','android']},
    token: String,
    user: String,
    createdAt: {type: Date, default: Date.now }
});

mongoose.model('Token',tokenSchema);


