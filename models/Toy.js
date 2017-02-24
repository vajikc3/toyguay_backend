/**
 * Created by icapa on 27/4/16.
 */
'use strict';

let util = require('util');

let mongoose = require ('mongoose');


// Add schema

let adSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    state: {type: String, required: true, default:0},
    price: {type: Number, required: true },
    seller: {type: mongoose.Schema.ObjectId, ref: 'User'},
    imageURL : {type: [String], required:false},
    categories: {type: [String], required:false},
    createdAt : {type: Date, required:true, default: Date.now()},
    updatedAt: {type: Date, required: true, default: Date.now()}
});

adSchema.statics.list = function(filter,start,limit,sort,cb){
    let query = Toy.find(filter);
    console.log('La query es:',filter);
    query.skip(start);
    query.limit(limit);
    query.sort([[sort,-1]]);

    return query.exec(cb);
};

/* Funcion que genera el filtro dependiendo si hay
un tag o varios
 */
adSchema.statics.tagsAFiltro = function(tag){
    //-- Es un array
    if (util.isArray(tag)===true){
        return {$in: tag};
    }
    return tag;
};

adSchema.statics.categoriesToArray = function(parameter){
  var arr = [];
  arr = parameter.split(',');
  return arr;
};

/* Funcion que convierte criterio de busqueda de precio a formato de mongo */
adSchema.statics.precioAFiltro = function(precio){
    let elFiltro={};
    let items = precio.split('-');

    if (items.length===1) {
        return precio;
    }
    if (items.length===2){  // El array es de dos, hay tres posibilidades
        console.log('Hay dos precios: ', items[0], items[1]);
        console.log('Los tipos son: ', typeof parseInt(items[0]), typeof parseInt(items[1]));
        if (items[0]!== '' && items[1]!==''){   // Busqueda completa, dos limites
            elFiltro={'$gte': parseInt(items[0]), '$lte': parseInt(items[1])};
        }
        else {  // Solo hay un límite
            if (items[0]!==''){ // limite inferior
                elFiltro={'$gte': parseInt(items[0])};
            }
            if (items[1]!==''){ // limite superior
                elFiltro={'$lte': parseInt(items[1])};
            }
        }
    }
    
    return elFiltro;

};

let Toy = mongoose.model('Toy',adSchema);
