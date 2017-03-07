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
let Transaction = mongoose.model('Transaction');
let Toy = mongoose.model('Toy');



/* Esto hay que ponerlo cuando se necesite autorizacion */
router.use(jwtAuth());

router.post('/',function(req,res){
    let lan = req.body.lan || req.query.lan  || 'es';
    let type = req.body.type || null;
    let toy = req.body.toy || null;
    let token = req.query.token;

    let buyer = null;
    let seller = null;

    let decoded='';

    try {
        decoded = jwt.verify(token, config.jwt.secret);
    }catch(err){
        console.log('Este usuario no existe');
        return res.status(403).json({sucess: false, error: translator('FORBIDDEN',lan)});
    }

    Toy.findOne({_id: toy},function(err,data){
       if (err || !data){
           return res.status(400).json({sucess: false, error: translator('TOY_NOT_FOUND',lan)});
       }
       buyer = decoded.id;
       seller = data.seller;
       console.log('Comprador: ',buyer,'Vendedor: ',seller);
       let tran = new Transaction({
           toy: toy,
           seller: seller,
           buyer: buyer,
           type: type,
       });
       tran.save(function(err,data){
           if (err || !data){
               return res.status(400).json({sucess: false, error: translator('TRANSACTION_ERROR',lan)});
           }
           return res.status(201).json({sucess: true});
       });


    });


});

router.get('/',function(req,res){
    let lan = req.body.lan || req.query.lan  || 'es';
    let token = req.query.token;
    let how = req.query.how;

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

    if (typeof how !== 'undefined'){
        if (how === 'buyer'){
            criteria.buyer = decoded.id;
        }
        else if (how === 'seller'){
            criteria.seller = decoded.id;
        }
    }else {
        if (decoded.admin === false) {
            criteria.$or = [
                {buyer: {$in: decoded.id}},
                {seller: {$in: decoded.id}},
            ]
        }
    }
    console.log('Filtrado de transacciones: ', criteria);
    Transaction.list(criteria,start,limit,'updatedAt',function(err,data){
        if (err){
            return res.status(400).json({sucess: false, error: translator('TRANSACTION_ERROR',lan)});
        }
        return res.status(200).json({sucess: true, rows: data});

    });


});

router.get('/:transactionId',function(req,res){
    let lan = req.body.lan || req.query.lan  || 'es';
    let token = req.query.token;
    let transactionId = req.params.transactionId;
    let decoded='';
    let criteria={};

    console.log('Detalle ->', transactionId);
    console.log('Con el token: ->',token);

    try {
        decoded = jwt.verify(token, config.jwt.secret);
    }catch(err){
        console.log('Este usuario no existe');
        return res.status(403).json({sucess: false, error: translator('FORBIDDEN',lan)});
    }


    Transaction.findOne({_id: transactionId},function(err,data){
        if (err){
            return res.status(400).json({sucess: false, error: translator('TRANSACTION_NOT_FOUND',lan)});
        }
        console.log('Comprador:',data.buyer,'Vendedor:',data.seller,'Admin:',decoded.id);
        if (data.buyer == decoded.id || data.seller == decoded.id){
            return res.status(200).json({sucess: true, row: data});
        }else{
            console.log('No pertenece al usuario');
            User.findOne({_id: decoded.id},function(err,usr){
                if (err){
                    return res.status(403).json({sucess: false, error: translator('FORBIDDEN',lan)});
                }
                if (usr.admin == true){
                    return res.status(200).json({sucess: true, row: data});
                }else{
                    return res.status(403).json({sucess: false, error: translator('FORBIDDEN',lan)});
                }
            });

        }
    }).populate('toy');


});

module.exports = router;