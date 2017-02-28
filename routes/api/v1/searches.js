'use strict';

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let translator = require ('../../../lib/translator');
let jwtAuth = require('../../../lib/jwtAuth');
let jwt = require('jsonwebtoken');
let config = require('../../../local_config');

let User = mongoose.model('User');
let Search = mongoose.model('Search');


/* Esto hay que ponerlo cuando se necesite autorizacion */
router.use(jwtAuth());

router.post('/',function(req,res){
    let lan = req.body.lan || req.query.lan  || 'es';
    let query = req.body.query || null;
    let category = req.body.category || null;
    let token = req.query.token;

    if (query==null && category==null){
        return res.status(400).json({sucess: false, error: translator('SEARCH_ERROR',lan)});
    }

    let decoded='';

    try {
        decoded = jwt.verify(token, config.jwt.secret);
    }catch(err){
        console.log('Este usuario no existe');
        return res.status(403).json({sucess: false, error: translator('FORBIDDEN',lan)});
    }

    let search = new Search({
        seller : decoded.id,
        query: query,
        category: category
    });

    search.save(function(err,data){
        if (err || !data) {
            return res.status(403).json({sucess: false, error: translator('FORBIDDEN', lan)});
        }
        return res.status(201).json({sucess: true});
    });

});

router.get('/',function(req,res){
    let lan = req.body.lan || req.query.lan  || 'es';
    let token = req.query.token;

    let limit = parseInt(req.query.limit) || 0;
    let start = parseInt(req.query.start) || null;

    let criteria={};

    let decoded='';
    try {
        decoded = jwt.verify(token, config.jwt.secret);
    }catch(err){
        console.log('Este usuario no existe');
        return res.status(403).json({sucess: false, error: translator('FORBIDDEN',lan)});
    }

    criteria.seller = decoded.id;



    Search.list(criteria,start,limit,'createdAt',function(err,data){
       if (err){
           return res.status(403).json({sucess: false, error: translator('FORBIDDEN',lan)});
       }
       return res.status(200).json({sucess: true, data: data});

    });

});



module.exports = router;