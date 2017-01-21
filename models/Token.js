/**
 * Created by icapa on 27/4/16.
 */
'use strict';

let mongoose = require ('mongoose');

// User schema

let tokenSchema = mongoose.Schema({
    platform: {type: String, enum: ['ios','android']},
    token: String,
    user: String
});

mongoose.model('Token',tokenSchema);


