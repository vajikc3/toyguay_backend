/**
 * Created by icapa on 27/4/16.
 */
'use strict';


let async = require('async');

let mongoose = require ('mongoose');

// User schema

let userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
});

userSchema.index({'email':1},{ unique: true});
userSchema.index({'name':1},{ unique: true});

userSchema.statics.buscaUsuarioEmail = function(usuario,email,callback){
    async.parallel({
        userFind: function(cb){
            User.findOne({name: usuario},function(err,user){
                if (err){
                    return cb(err,null);
                }
                if (user){
                    return cb(null,true);
                }
                return cb(null,false);
            });
        },
        emailFind: function(cb){
            User.findOne({email: email},function(err,user){
                if (err){
                    return cb(err,null);
                }
                if (user){
                    console.log('Encontrado email ->', user.email);
                    return cb(null,true);
                }
                console.log('No encontramos emaul');
                return cb(null,false);
            });
        }
        },function(err,result){
            console.log('Acaba async usuario,email',result.userFind,result.emailFind);
            callback(err,[result.userFind,result.emailFind]);
        }
    );
};

let User =  mongoose.model('User',userSchema);
