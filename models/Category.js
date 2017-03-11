'use strict';

let mongoose = require ('mongoose');

// User schema

let categorySchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    name_es: {type: String, required: true, unique: true},
    name_en: {type: String, required: true, unique: true}
});


let Category =  mongoose.model('Category',categorySchema);

