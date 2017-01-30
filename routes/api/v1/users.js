/**
 * Created by icapa on 24/4/16.
 */

'use strict';
let jwt = require('jsonwebtoken');

let config = require('../../../local_config');

let express = require('express');
let router = express.Router();

require('mongoose');


let translator = require('../../../lib/translator');





let User = require('mongoose').model('User');   // Cargamos el usuario


router.post('/register',function(req,res){


    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let nick_name = req.body.user;
    let password = req.body.password;
    let password_repeat = req.body.password_repeat;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let imageURL = req.body.imageURL;
    let state = req.body.state;


    let idioma = req.body.lan || req.query.lan  || 'es';
    let hashPas='';

    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');

    if (password != password_repeat){
        return res.json({sucess: false, error:translator('PASSWORDS_NOT_MATCH',idioma)});
    }

    hashPas = hash.update(password).digest('hex');

    let usuario = new User(
        {
            first_name: first_name,
            last_name: last_name,
            email: email,
            nick_name: nick_name,
            password: hashPas,
            latitude: latitude,
            longitude: longitude,
            state: state,
            imageURL: imageURL
        }
    );

    usuario.save(function(err,saved){
        if (err){
            console.log('Error insertando usuario ->', err);
            return res.json({sucess: false, error:translator('REGISTER_ERROR',idioma)});
        }
        return res.json({sucess: true, saved: saved});

    });


    /*
    User.buscaUsuarioEmail(name,email,function(err,data){
        if (err){
            res.json({sucess:false, error:translator('WRONG_AUTH_PARAMS',idioma)});
            return;
        }
        if (data[0]===true){
            res.json({sucess:false, error:translator('USER_REGISTERED',idioma)});
            return;
        }
        if (data[1]===true){
            res.json({sucess: false, error:translator('EMAIL_REGISTERED',idioma)});
            return;
        }
        //-- Si no podemos insertar el registro

        // Aqui damos de alta
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256');

        hashPas = hash.update(password).digest('hex');

        let usuario = new User({name: name,email: email,password: hashPas});

        usuario.save(function(err,saved){
            if (err){
                return res.json({sucess: false, error:translator('REGISTER_ERROR',idioma)});
            }
            return res.json({sucess: true, saved: saved});


        });



    });
    */

});






/* GET users listing. */
router.post('/authenticate', function(req, res) {
    let name = req.body.user;
    let password = req.body.password;
    let email = req.body.email;
    let idioma = req.body.lan || req.query.lan  || 'es';
    let passHaseado='';


    console.log('Busco nombre o usuario e idioma',email,name,idioma);

    User.buscaUsuarioEmail(name,email,function(err,user){
        if (err){
            return res.status(500).json({sucess: false, error: translator('WRONG_AUTH_PARAMS',idioma)});
        }
        if (!user){
            return res.status(401).json({sucess: false, error: translator('USER_NOT_FOUND',idioma)});
        }


        const crypto = require('crypto');
        const hash = crypto.createHash('sha256');

        passHaseado = hash.update(password).digest('hex');
        console.log('Hash pedido hasheado:',passHaseado);
        if (passHaseado !== user.password){
            return res.status(401).json({sucess: false, error: translator('AUTH_FAILED',idioma)});
        }
        let token = jwt.sign({id: user._id},config.jwt.secret,{
            expiresIn: '2 days'
        });

        res.json({sucess: true, token: token});
    });
    /*
    // Podemos hacer que autorice con usuario y contraseña
    User.findOne({nick_name: name, email:email}).exec(function(err,user){
        console.log('Esto hemos encontrado: ', user, err);
        if (err){
            return res.status(500).json({sucess: false, error: translator('WRONG_AUTH_PARAMS',idioma)});
        }
        if (!user){
            return res.status(401).json({sucess: false, error: translator('USER_NOT_FOUND',idioma)});
        }
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256');

        passHaseado = hash.update(password).digest('hex');
        console.log('Hash pedido hasheado:',passHaseado);
        if (passHaseado !== user.password){
            return res.status(401).json({sucess: false, error: translator('AUTH_FAILED',idioma)});
        }
        let token = jwt.sign({id: user._id},config.jwt.secret,{
            expiresIn: '2 days'
        });

        res.json({sucess: true, token: token});
    });
    */
});

    
module.exports = router;
