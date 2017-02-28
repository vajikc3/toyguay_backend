'use strict';

let util = require('util');

let mongoose = require ('mongoose');

let searchSchema = mongoose.Schema({
    seller: {type: mongoose.Schema.ObjectId, ref: 'User'},
    query : {type: String, required: false},
    category: {type: String, required:false},
    createdAt : {type: Date, required:true, default: Date.now()}
});

searchSchema.statics.list = function(filter,start,limit,sort,cb){
    let query = Search.find(filter);
    console.log('La query es:',filter);
    query.skip(start);
    query.limit(limit);
    query.sort([[sort,-1]]);
    return query.exec(cb);
};

searchSchema.statics.findUserForNotitication= function(query, category, cb){
    let criteria= {};
    criteria.$or=[
        { query : {
                $in: [query]
            }
        },
        {description : {
                $in: [query]
            }
        },
        {category: {
                $in: [category]
            }
        }
    ];
    let querySearch = Search.find(criteria,'seller');
    console.log('La query es: ', criteria);
    querySearch.sort([['createdAt',-1]]);
    return querySearch.exec(cb);
};



let Search = mongoose.model('Search',searchSchema);