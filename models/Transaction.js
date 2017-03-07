'use strict';

let util = require('util');

let mongoose = require ('mongoose');

let transactionSchema = mongoose.Schema({
    seller: {type: mongoose.Schema.ObjectId, ref: 'User'},
    buyer: {type: mongoose.Schema.ObjectId, ref: 'User'},
    toy: {type: mongoose.Schema.ObjectId, ref: 'Toy'},
    type : {type: String, required: false},
    updatedAt : {type: Date, required:true, default: Date.now()},
    createdAt : {type: Date, required:true, default: Date.now()}
});

transactionSchema.statics.list = function(filter,start,limit,sort,cb){
    let query = Transaction.find(filter);
    console.log('La query es:',filter);
    query.skip(start);
    query.limit(limit);
    query.sort([[sort,-1]]);
    query.populate('toy');
    return query.exec(cb);
};


let Transaction = mongoose.model('Transaction',transactionSchema);