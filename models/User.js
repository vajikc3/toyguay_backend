'use strict';


let async = require('async');

let mongoose = require ('mongoose');

// User schema

let userSchema = mongoose.Schema({
    entity: {type: Number, required: false, default: 0},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique:true},
    nick_name: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    latitude:{type: Number, required: false },
    longitude:{type: Number, required: false },
    state: {type: Number, required:false},
    imageURL : {type: String, required:false}

});

userSchema.index({'email':1},{ unique: true});
userSchema.index({'nick_name':1},{ unique: true});

userSchema.statics.buscaUsuarioEmail = function(usuario,email,callback){
    async.parallel({
        userFind: function(cb){
            User.findOne({nick_name: usuario},function(err,user){

                if (err){
                    return cb(err,null);
                }
                if (user){
                    console.log('Encontrado usuario ->', user.nick_name);
                    return cb(null,user);
                }
                return cb(null,null);
            });
        },
        emailFind: function(cb){
            User.findOne({email: email},function(err,user){

                if (err){
                    return cb(err,null);
                }
                if (user){
                    console.log('Encontrado email ->', user.email);
                    return cb(null,user);
                }
                console.log('No encontramos emaul');
                return cb(null,null);
            });
        }
        },function(err,result){

            var found_user = null;
            if (result.userFind){
                found_user = result.userFind;
            }
            else if (result.emailFind){
                found_user = result.emailFind;
            }

            callback(err,found_user);
        }
    );
};

let User =  mongoose.model('User',userSchema);
