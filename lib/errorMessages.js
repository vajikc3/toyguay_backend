/**
 * Created by icapa on 23/4/16.
 */
'use strict'
var fs = require('fs');

var obj = JSON.parse(fs.readFileSync('./error_messages/errorMessages.json', 'utf8'));

module.exports=obj;