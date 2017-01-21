/**
 * Created by icapa on 23/4/16.
 */

/* Fichero para probar el modulo de los errores */

console.log(' --- Cargando test de traslator ---');

var test = require ('./translator');

console.log('--- Ahora llamo a la funcion --- ');

var resp=test('USER_NOT_FOUND','es');
console.log(resp);



