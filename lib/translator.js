/**
 * Created by icapa on 23/4/16.
 */
/* Módulo para traducir los mensajes de error */
'use strict';

var errorMessages = require('./errorMessages');

var translate = function(error,language){
    try {
        return (errorMessages[error][language]);
    }
    catch(error){
        return 'Undefined error';
    }
};

module.exports = translate;