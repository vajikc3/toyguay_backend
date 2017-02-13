/**
 * Created by icapa on 24/4/16.
 */

'use strict';
let jwt = require('jsonwebtoken');
let jwtAuth = require('../../../lib/jwtAuth');

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


    let lan = req.body.lan || req.query.lan  || 'es';
    let hashPas='';

    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');

    if (password != password_repeat){
        return res.status(400).json({sucess: false, error:translator('PASSWORDS_NOT_MATCH',lan)});
    }

    hashPas = hash.update(password).digest('hex');

    if (User.validateUserName(nick_name)==false){
        return res.status(400).json({sucess:false,error:translator('INVALID_USER_NAME',lan)});
    }
    if (User.validateEmail(email)==false){
        return res.status(400).json({sucess:false,error:translator('INVALID_EMAIL',lan)});
    }
    if (User.validatePassword(password)==false){
        return res.status(400).json({sucess:false,error:translator('INVALID_PASSWORD',lan)});
    }

    let usuario = new User(
        {
            first_name: first_name,
            last_name: last_name,
            email: email,
            nick_name: nick_name,
            password: hashPas,
            location: {
                $geometry : {
                    type: 'Point',
                    coordinates : [latitude,longitude]
                }
            },
            state: state,
            imageURL: imageURL
        }
    );


    usuario.save(function(err,saved){
        if (err){
            console.log('Error insertando usuario ->', err);
            return res.status(400).json({sucess: false, error:translator('REGISTER_ERROR',idioma)});
        }
        return res.status(201).json({sucess: true, saved: saved});

    });




});






/* GET users listing. */
router.post('/authenticate', function(req, res) {
    let name = req.body.user;
    let password = req.body.password;
    let email = req.body.email;
    let lan = req.body.lan || req.query.lan  || 'es';
    let passHaseado='';


    console.log('Busco nombre o usuario e idioma',email,name,lan);

    User.findUserOrMail(name,email,function(err, user){
        if (err){
            return res.status(500).json({sucess: false, error: translator('WRONG_AUTH_PARAMS',lan)});
        }
        if (!user){
            return res.status(401).json({sucess: false, error: translator('USER_NOT_FOUND',lan)});
        }


        const crypto = require('crypto');
        const hash = crypto.createHash('sha256');

        passHaseado = hash.update(password).digest('hex');
        console.log('Hash pedido hasheado:',passHaseado);
        if (passHaseado !== user.password){
            return res.status(401).json({sucess: false, error: translator('AUTH_FAILED',lan)});
        }
        let token = jwt.sign({id: user._id},config.jwt.secret,{
            expiresIn: '24h'
        });

        return res.status(200).json({sucess: true, token: token});
    });
});



router.post('/recover',function(req,res){
    let user = req.body.user;
    let email = req.body.email;
    let lan = req.body.lan || req.query.lan  || 'es';

    console.log('Recuperando contraseña ',user, email);
    // Try to find user
    User.findUserOrMail(user,email,function(err, user){
        if (err){
            return res.status(400).json({sucess: false, error: translator('WRONG_AUTH_PARAMS',lan)});
        }
        if (!user){
            return res.status(400).json({sucess: false, error: translator('USER_NOT_FOUND',lan)});
        }
        return res.status(200).json({sucess: true, error: 'Enviando emil a: '+user.email});

    });

});



/* Endpoints that required auth */
/* LO QuITO PARA PROBAR LA API HAY Q PONERLO
router.use(jwtAuth());
TODO */

router.delete('/:userid',function(req,res){
    console.log('Borrando usuario ->', req.params.userid);
    let lan = req.body.lan || req.query.lan  || 'es';
    let token = req.query.token;
    let decoded='';
    try {
        decoded = jwt.verify(token, config.jwt.secret);
    }catch(err){
        return res.status(403).json({sucess: false, error: translator('FORBIDDEN',lan)});
    }
    console.log('Decodificando token usuario->', decoded.id);
    console.log('Comprobando usuario ');
    console.log('Decodificando ->', token);

    User.findOne({_id: decoded.id}, function(err,user){
        if (err){
            return res.status(404).json({sucess: false, error: translator('USER_NOT_FOUND',lan)});
        }
        // Look for the user who made de query
        if (user){
            if (user.admin == true){
                // If the user is admin can delete any user
                User.remove({_id: req.params.userid }, function(err,user){
                    if (err){
                        return res.status(404).json({sucess : false, error: translator('USER_NOT_FOUND',lan)})
                    }else{
                        console.log('Borrando ->',user.result);
                        return res.status(204).json({sucess: true});
                    }
                });
            }
            else{
                User.findOne({_id: req.params.userid},function(err,user){
                    if (err){
                        return res.status(404).json({sucess: false, error: translator('USER_NOT_FOUND',lan)});
                    }else{
                        if (!user){
                            return res.status(404).json({sucess: false, error: translator('USER_NOT_FOUND',lan)});
                        }

                        if (decoded.id != req.params.userid){
                            return res.status(403).json({sucess: false, error: translator('FORBIDDEN',lan)});
                        }
                        console.log('Usuario correcto para borrar');
                        // Test decoded data is the user




                        User.remove({_id: req.params.userid }, function(err,user){
                            if (err){
                                return res.status(404).json({sucess : false, error: translator('USER_NOT_FOUND',lan)})
                            }else{
                                console.log('Borrando ->',user.result);
                                return res.status(204).json({sucess: true});
                            }
                        });

                    }
                });
            }
        }

    });
});


router.put('/:userid',function(req,res) {
    let user=req.params.userid;
    let lan = req.body.lan || req.query.lan  || 'es';

    let first_name = req.body.first_name || null;
    let last_name = req.body.last_name || null;
    let email = req.body.email || null;


    let latitude = req.body.latitude || null;
    let longitude = req.body.longitude || null;
    let imageURL = req.body.imageURL || null;

    let city = req.body.city || null;
    let province = req.body.province || null;
    let country = req.body.country || null;


    console.log('Actualizando usuario ->',req.params.userid);
    User.findOne({_id: user},function(err,user){
        if (err){
            return res.status(404).json({sucess : false, error: translator('USER_NOT_FOUND',lan)});
        }
        if (!user){
            return res.status(404).json({sucess : false, error: translator('USER_NOT_FOUND',lan)});
        }
        else{

            if (first_name){
                user.first_name = first_name;
            }
            if (last_name){
                user.last_name = last_name;
            }
            if (email){
                if (User.validateEmail(email)){
                    user.email = email
                }
                else{
                    return res.status(400).json({sucess: false, error: translator('WRONG_AUTH_PARAMS',lan)});
                }
            }
            if (latitude && longitude){
                user.location.coordinates = [latitude, longitude];
            }
            if (imageURL){
                user.imageURL = imageURL;
            }

            if (city){
                user.city = city;
            }
            if (province){
                user.province = province;
            }
            if (country){
                user.country = country;
            }

            user.save(function(err,saved){
                if (err){
                    return res.status(400).json({sucess: false, error: translator('WRONG_AUTH_PARAMS',lan)});
                }
                else{
                    return res.status(200).json({sucess : true});
                }
            });

        }
    });

});

router.put('/password/:userid',function(req,res) {
    let passHaseado = null;
    let user=req.params.userid;
    let lan = req.body.lan || req.query.lan  || 'es';

    let old_pass = req.body.old_pass || null;
    let new_pass = req.body.new_pass || null;
    let new_pass2 = req.body.new_pass_repeat || null;
    if (!old_pass || !new_pass || !new_pass2){
        return res.status(400).json({sucess: false, error: translator('WRONG_AUTH_PARAMS',lan)});
    }
    if (new_pass != new_pass2){
        return res.status(400).json({sucess: false, error:translator('PASSWORDS_NOT_MATCH',lan)});
    }

    User.findOne({_id: user}, function(error,user){
       if (error){
           return res.status(404).json({sucess : false, error: translator('USER_NOT_FOUND',lan)});
       }
       if (!user){
           return res.status(404).json({sucess : false, error: translator('USER_NOT_FOUND',lan)});
       }

       const crypto = require('crypto');
       const hash = crypto.createHash('sha256');

       passHaseado = hash.update(old_pass).digest('hex');



       if (passHaseado !== user.password){
            return res.status(401).json({sucess: false, error: translator('AUTH_FAILED',lan)});
       }

       if (User.validatePassword(new_pass)==false){
           return res.status(400).json({sucess:false,error:translator('INVALID_PASSWORD',lan)});
       }
       const hash_new = crypto.createHash('sha256');

       passHaseado = hash_new.update(new_pass).digest('hex');

       user.password = passHaseado;

       user.save(function(err,user){
           if (err){
               return res.status(400).json({sucess: false, error: translator('WRONG_AUTH_PARAMS',lan)});
           }
           return res.status(200).json({sucess: true});
       })


    });

});

module.exports = router;
