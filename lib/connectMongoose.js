/**
 * Created by icapa on 27/4/16.
 */
'use strict';

var mongoose = require('mongoose');
var conn = mongoose.connection;

//Handlers de los eventos de conexion

conn.once('open',function(err,db){
    if (err){
        console.log('!!! Error connecting to mongoDb');
        return;
    }
   
    console.log('Connected to mongoDb'); 
});


mongoose.connect('mongodb://localhost:27017/nodepopdb');
