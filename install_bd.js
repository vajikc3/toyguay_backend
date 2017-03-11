'use strict';

let mongoose = require('mongoose');

require('./lib/connectMongoose');

require('./models/User');
require('./models/Toy');
require('./models/Token');
require('./models/Category');



let User = require('mongoose').model('User');
let Toy = require('mongoose').model('Toy');
let Token = require('mongoose').model('Token');
let Category = require('mongoose').model('Category');


let user = new User({first_name:'Bardal',
    last_name:'Bardal',
    nick_name: 'bardal',
    email:'bardal@toyguay.es',
    location:{
        type: 'Point',
        coordinates: [43.4722475, -3.8199358]
    },
    province: 'Cantabria',
    city: 'Parbayón',
    country: 'España',
    password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    admin: true
});



let token = new Token({platform:'ios', user:'admin', token:'fake_token'});



let juguete1 = new Toy({
    name: 'Pelota',
    description: 'Balón de fútbol',
    state: 'Selling',
    price: '5.5',
    seller: user._id,
    categories: ['sports', 'street'],
    imageURL: ['https://i.ytimg.com/vi/QqwxNpQObJ8/maxresdefault.jpg']
});

let juguete2 = new Toy({
    name: 'Muñeca' ,
    description: 'Muy rara y muy bien vestida',
    state: 'Selling',
    price: "0.0",
    seller: user._id,
    categories: ['dolls', 'home'],
    imageURL: ['http://mkz.tkzstatic.com/images/productos/muneca-clara_961_full.jpg']

});
let juguete3 = new Toy({
    name: 'Lego' ,
    description: 'Ciudad de lego',
    state: 'Selling',
    price: "10.0",
    seller: user._id,
    categories: ['kids', 'construction' ],
    imageURL: ['https://lc-www-live-s.legocdn.com/r/www/r/city/-/media/franchises/city2014/products/themes/town.jpg']

});
let juguete4 = new Toy({
    name: 'Playmobil' ,
    description: 'Barco Pirata',
    state: 'Selling',
    price: "50.0",
    seller: user._id,
    categories: ['kids','home','playmobil'],
    imageURL: ['http://www.klickypedia.com/wp-content/uploads/2015/01/3050us-pirate-ship-box-00.jpg']
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

    creaCategorias();

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

    juguete1.save(function (err,reg) {
        if (err) {
            console.log('Error juguete 1 !!! ', err);
            return;
        }
        console.log('Insertado juguete')
        juguete2.save(function(err,req){
            if (err){
                console.log('Error juguete 2 !!!' , err);
                cb(err);
                return;
            }
            console.log('Insertado juguete');
            juguete3.save(function(err,req){
                if (err){
                    console.log('Error juguete 2 !!!' , err);
                    cb(err);
                    return;
                }
                console.log('Insertado juguete');
                juguete4.save(function(err,req){
                    if (err){
                        console.log('Error juguete 2 !!!' , err);
                        cb(err);
                        return;
                    }
                    console.log('Insertado juguete');
                    cb();
                });
            });
        });

    });
}

function creaCategorias()
{
    Category.remove({},function(err){
        if (err){
            console.log('Error borrando las categorias');
            return;
        }
        let cat1= new Category({name: 'sports',name_es:'deporte',name_en:'sports'});
        let cat2= new Category({name: 'dolls',name_es:'muñecas',name_en:'dolls'});
        let cat3= new Category({name: 'kids',name_es:'niñ@s',name_en:'kids'});
        let cat4= new Category({name: 'builds',name_es:'construcciones',name_en:'builds'});
        let cat5= new Category({name: 'home',name_es:'casa',name_en:'home'});
        cat1.save();
        cat2.save();
        cat3.save();
        cat4.save();
        cat5.save();


    })
}



