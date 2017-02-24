'use strict';

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let translator = require ('../../../lib/translator');
let jwtAuth = require('../../../lib/jwtAuth');
let jwt = require('jsonwebtoken');
let config = require('../../../local_config');

let User = mongoose.model('User');

let Toy = mongoose.model('Toy');



/* Esto hay que ponerlo cuando se necesite autorizacion */
router.use(jwtAuth());

router.post('/',function(req,res){
    let lan = req.body.lan || req.query.lan  || 'es';
    let url = req.body.url;
    let toyid = req.body.toyid;
    let token = req.query.token;

    let decoded='';

    try {
        decoded = jwt.verify(token, config.jwt.secret);
    }catch(err){
        console.log('Este usuario no existe');
        return res.status(403).json({sucess: false, error: translator('FORBIDDEN',lan)});
    }

    Toy.findOne({_id: toyid},function(err,toy){
       if (err || !toy){
           return res.status(400).json({sucess: false, error: translator('TOY_NOT_FOUND',lan)});
       }
       if (decoded.id != toy.seller){
           return res.status(403).json({sucess: false, error: translator('FORBIDDEN',lan)});
       }
       else{
           if (verifyURL(url)==false){
               return res.status(400).json({sucess: false, error: translator('WRONG_URL',lan)});

           }
           console.log('Subiendo imagenes');
           //--
           var arrayUrl = toy.imageURL;
           arrayUrl.push(url);
           console.log('URL de imagenes:',arrayUrl);
           toy.imageURL=arrayUrl;
           toy.save(function(err,data){
              if (err || !data) {
                  return res.status(403).json({sucess: false, error: translator('FORBIDDEN', lan)});
              }
              return res.status(201).json({sucess: true});
           });

       }

    });




});

let verifyURL = function(url){
    var regularExpression = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    if (!regularExpression.test(url)){
        return false;
    }
    else{
        return true;
    }
    return true;
};

module.exports = router;