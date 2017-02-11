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
    location: {
        type: { String },
        coordinates:  [Number],
        required: false
    },
    state: {type: Number, required:false},
    imageURL : {type: String, required:false}

});

userSchema.index({'email':1},{ unique: true});
userSchema.index({'nick_name':1},{ unique: true});
userSchema.index({location: '2dsphere'});


userSchema.statics.findUserOrMail = function(usuario, email, callback){
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

userSchema.statics.validateUserName = function(user){
    var regularExpression = /^[a-zA-Z0-9_@.-]{1,30}$/;
    if (!regularExpression.test(user)){
        return false;
    }
    else {
        return true;
    }
};

userSchema.statics.validateEmail = function(email){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //var regularExpression = /^(?=.*[.@])[a-zA-Z0-9_.-]{3,40}/;
    if (!re.test(email)){
        return false;
    }
    else {
        return true;
    }
};

userSchema.statics.validatePassword = function(password){
    var regularExpression = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d#?!@$%^&*-]{6,50}$/;
    if (!regularExpression.test(password)){
        return false;
    }
    else{
        return true;
    }
    return true;
};

let User =  mongoose.model('User',userSchema);
