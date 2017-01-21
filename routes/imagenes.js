/**
 * Created by icapa on 4/5/16.
 */
/**
 * Created by icapa on 24/4/16.
 */
'use strict';

let express = require('express');
let router = express.Router();

require('mongoose');

let translator = require ('../lib/translator');

require('../lib/jwtAuth');




//-- Requerimos autentificacion para todo

//router.use(jwtAuth());

router.get('/:imagen',function(req,res){
    console.log('la imagen '+req.params.imagen);
    let idioma = req.query.lan || 'es';
    res.download('./public/images/'+req.params.imagen,req.params.imagen,function(err){
        if (err){
            return res.json({sucess:false,error:translator('IMAGE_NOT_FOUND',idioma)});
        }
    });

});

module.exports = router;