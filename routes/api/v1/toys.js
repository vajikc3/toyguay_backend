/**
 * Created by icapa on 24/4/16.
 */
'use strict';

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let translator = require ('../../../lib/translator');
let jwtAuth = require('../../../lib/jwtAuth');

let User = mongoose.model('User');

let Toy = mongoose.model('Toy');

//-- Requerimos autentificacion para todo

/* Esto hay que ponerlo cuando se necesite autorizacion */
router.use(jwtAuth());

/* GET users listing. */
router.get('/', function(req, res) {
    let tag = req.query.tag;
    let category = req.query.category;
    let seller = req.query.seller;
    let latitude = req.query.latitude;
    let longitude = req.query.longitude;
    let radius = req.query.radius;


    let incluirTotal = req.query.incluirTotal || false;

    let idioma = req.query.lan || 'es'; // Si hay idioma se coge, si no por defecto
    //---
    let limit = parseInt(req.query.limit) || 0;
    let start = parseInt(req.query.start) || null;

    console.log('Tags:',tag);
    console.log('Seller:',seller);
    console.log('Latitude:',latitude);
    console.log('Longitude:',longitude);
    console.log('Radius:',radius);
    console.log('Categories:',category);


    
    //console.log(tag,venta,nombre,precio,limit,start,sort);
    let criteria = {};
    let criteriaLocal = {};

    if (typeof tag !== 'undefined'){
        criteria.$or=[
            {name : {$in: Toy.tagsAFiltro(tag)}},
            {description : {$in: Toy.tagsAFiltro(tag)}}
        ]
    }
    if (typeof seller !== 'undefined'){
        criteria.seller = seller;
    }
    if (typeof category !== 'undefined'){
        criteria.categories = category;
    }

    if (typeof latitude !== 'undefined' && typeof longitude !== 'undefined' && typeof radius !== 'undefined'){
        console.log('Busqueda por situacion del vendedor:',latitude,longitude,radius);
        let METERS_PER_KM = 1000;

        criteriaLocal['location'] =
            {
            $nearSphere:{
                $geometry:{
                    type: 'Point',
                    coordinates: [parseFloat(latitude), parseFloat(longitude)]
                },
                $maxDistance : radius * METERS_PER_KM
            }
        };
        var promise = User.find(criteriaLocal,'_id').populate('_id').exec();

        promise.then(function(users) {
            console.log('Busqueda de usuario hecha', users);

            let arr=[]
            for(var i in users) {
                console.log('LA PUTA i vale: ', i);
                console.log('EL VALOR ES: ', users[i]['_id']);
                arr.push(users[i]['_id']);
            }
            console.log('Y el array final es: ', arr);


            criteria.seller = {
                    $in:
                        arr
                };
                console.log('Criteria Toys (GEOLOCALIZACION)->', criteria);
                Toy.list(criteria, start, limit, 'updatedAt', function (err, rows) {
                    if (err) {
                        console.log('Error en listado:', err);
                        return res.json({sucess: false, error: translator('WRONG_QUERY', idioma)});
                    }
                    console.log('Se quiere incluir total', incluirTotal);

                    return res.json({sucess: true, total: rows.length, rows: rows});

                });
            })
            .catch(function(err){
                // just need one of these
                return res.json({sucess: false,  error: err});
            });

    }
    else {
        console.log('Criteria Toys ->', criteria);

        Toy.list(criteria, start, limit, 'updatedAt', function (err, rows) {
            if (err) {
                console.log('Error en listado:', err);
                return res.json({sucess: false, error: translator('WRONG_QUERY', idioma)});
            }
            console.log('Se quiere incluir total', incluirTotal);

            return res.json({sucess: true, total: rows.length, rows: rows});

        });
    }

});



module.exports = router;
