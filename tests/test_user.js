
'use strict';

require('mongoose');

// Conexion a la base de datos
//require('../lib/connectMongoose');


require('../models/User');



let User = require('mongoose').model('User');   // Cargamos el usuario


console.log('--- User validation ---');
let user_ok = 'pepito';
let user_wrong = '#!soymalo';
let user_long = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
let user_short = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
console.log('User OK ->',User.validateUserName(user_ok));
console.log('User Wrong ->', User.validateUserName(user_wrong));
console.log('User Long ->', User.validateUserName(user_long));
console.log('User short ->', User.validateUserName(user_short));

console.log('--- email validation ---');
let email_ok='test@test.com';
let email_wrong = 'fakeemail@ddsads';
let email_wrong2 = 'fake@@test.com';
console.log('Email OK ->', User.validateEmail(email_ok));
console.log('Email wrong ->', User.validateEmail(email_wrong));
console.log('Email wrong2 ->', User.validateEmail(email_wrong2));

console.log('--- Validate password');
let password_ok = 'azAZ01@';
let password_wrong = '123456';
let password_wrong2 = 'admin';
let password_long='aaaaaaaaaabbbbbbbbbbAAAAAAAAAA0000000000@@@@@@@@@@:)';
let password_good = 'Adm1n!sTr@t0r'
console.log('Password OK ->',User.validatePassword(password_ok));
console.log('Password Wrong ->',User.validatePassword(password_wrong));
console.log('Password Wrong2->', User.validatePassword(password_wrong2));
console.log('Password long->', User.validatePassword(password_long));
console.log('Password good->', User.validatePassword(password_good));



