/**
 * Created by icapa on 24/4/16.
 */
'use strict';

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let translator = require ('../../../lib/translator');
let jwtAuth = require('../../../lib/jwtAuth');


let Ad = mongoose.model('Ad');

//-- Requerimos autentificacion para todo

router.use(jwtAuth());

/* GET users listing. */
router.get('/', function(req, res) {
    let tag = req.query.tag;
    let venta = req.query.venta;
    let nombre = req.query.nombre;
    let precio = req.query.precio;
    let incluirTotal = req.query.incluirTotal || false;

    let idioma = req.query.lan || 'es'; // Si hay idioma se coge, si no por defecto
    //---
    let limit = parseInt(req.query.limit) || 0;
    let start = parseInt(req.query.start) || null;
    let sort = req.query.sort || null;
    
    //console.log(tag,venta,nombre,precio,limit,start,sort);
    let criteria = {};
    
    if (typeof nombre !== 'undefined'){
        criteria.nombre = new RegExp('^' + nombre, 'i');
        //console.log('Criterio de nombre ->',criteria.name);
    }
    if (typeof tag !== 'undefined'){
        criteria.tags = Ad.tagsAFiltro(tag);
    }
    if (typeof venta !== 'undefined'){
        criteria.venta=venta;
    }
    if (typeof precio !== 'undefined'){
        criteria.precio = Ad.precioAFiltro(precio);
    }
    if (typeof venta !== 'undefined'){
        if (venta==='true'){
            criteria.venta=true;
        }
        else{
            criteria.venta=false;
        }
    }

    //console.log('Criteria ->',criteria);

    Ad.list(criteria,start,limit,sort,function(err,rows) {
        if (err) {
            return res.json({sucess: false, error: translator('WRONG_QUERY',idioma)});
        }
        console.log('Se quiere incluir total', incluirTotal);
        if (incluirTotal==='true'){
            return res.json({sucess: true, total:rows.length, rows:rows});
        }
        return res.json({sucess: true, rows: rows});

    });
});



module.exports = router;
