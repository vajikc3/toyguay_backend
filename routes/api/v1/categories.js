'use strict';


let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let translator = require ('../../../lib/translator');
let jwtAuth = require('../../../lib/jwtAuth');
let jwt = require('jsonwebtoken');
let config = require('../../../local_config');



let Category  = mongoose.model('Category');

/* Esto hay que ponerlo cuando se necesite autorizacion */
//router.use(jwtAuth());

router.get('/',function(req,res){
    let lan = req.body.lan || req.query.lan  || 'es';
    Category.find({},function(err,rows){
        if (err){
            return res.status(400).json({sucess: false, error: translator('WRONG_QUERY', lan)});
        }
        return res.status(200).json({sucess: true, rows: rows});
    });
});

module.exports = router;


