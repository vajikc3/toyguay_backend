'use strict';

let mongoose = require('mongoose');

require('./lib/connectMongoose');

require('./models/User');
require('./models/Toy');
require('./models/Token');



let User = require('mongoose').model('User');
let Toy = require('mongoose').model('Toy');
let Token = require('mongoose').model('Token');

let user = new User({first_name:'Bardal', last_name:'Bardal', nick_name: 'bardal', email:'bardal@toyguay.es',password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'});
let token = new Token({platform:'ios', user:'admin', token:'fake_token'});
let juguete1 = new Toy({
    name: 'Pelota' ,
    description: 'Balón de fútbol',
    state: 'Nuevo',
    price: '5.5',
    seller: user._id,
    imageURL: 'https://i.ytimg.com/vi/QqwxNpQObJ8/maxresdefault.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now()}
);

let juguete2 = new Toy({
    name: 'Muñeca' ,
    description: 'Muy rara y muy bien vestida',
    state: 'Usada',
    price: "0.0",
    seller: user._id,
    imageURL: 'http://mkz.tkzstatic.com/images/productos/muneca-clara_961_full.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now()
});


// Script para cargar la base de datos

console.log('-- Initializing bbdd ---');

console.log('Deleting all the collections....');

User.remove({},function(err){
   if (err){
       console.log('\t Error deleting users!');
       return;
   }
    console.log('\t Users deleted OK!!');
    Toy.remove({},function(err){
        if (err){
            console.log('\t Error deleting toys!');
            return;
        }
        console.log('\t Toys deleted OK!!');

        Token.remove({},function(err){
            if (err){
                console.log('\t Error deleting Tokens!');
                return;
            }
            console.log('\t Tokens deleted OK!!');
            rellenaBBDD(function(err){
                if (err){
                    return console.log('-- ERROR CREANDO BBDD !!!');
                }
                rellenaJuguetes(function(err){
                    if (!err){
                        console.log('-- BBDD structure created OK !!!!---');
                    }
                    else
                    {
                        console.log('There was an error completing BBDD structure !!');
                    }
                    console.log('Closing database...');
                    mongoose.connection.close();
                });

            });
        });
    });
});

function rellenaBBDD(cb){

    console.log('Filling bbdd with data...');
    user.save(function(err,reg){
        if (err){
            console.log('Error !!! ',err);
            cb(err);
            return;
        }
        console.log('User -> '+reg.name+ ' email->'+reg.email);
        token.save(function(err,reg){
            if (err){
                console.log('Error inserting token!');
                cb(err);
                return;
            }
            console.log('Token:');
            console.log('\tUser: '+reg.user+', '+reg.platform+', '+reg.token);
            cb(null);
            return;
        });

    });
}
/*
function rellenaJuguetes(cb){
    try {
        let anunciosFs = require('fs').readFileSync('juguetes.json', 'utf-8');
        let anunciosJson= JSON.parse(anunciosFs);
        console.log('Inserting: '+ anunciosJson.anuncios.length+ ' ads');
        mongoose.connection.collection('ads').insert(anunciosJson.anuncios);
        cb(null);
    }catch(err){
        console.log('-- Error reading ad file...'+ err);
        cb(err);
    }
}
*/
function rellenaJuguetes(cb){

    juguete1.save(function (err,reg){
        if (err){
            console.log('Error juguete 1 !!! ',err);
            cb(err);
            return;
        }
        juguete2.save(function(err,req){
           if (err){
               console.log('Error juguete 2 !!!' , err);
               cb(err);
               return;
           }
           cb(null);
           console.log('Insertados juguetes -> OK');
        });

    });

}




