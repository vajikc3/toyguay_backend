#ToyGuay Backend API#

##1.- Introducción
En este documento se describe la funcionalidad de la API ToyGuay. Esta API tiene la utilidad de gestionar usuarios, juguetes y las transacciones.

##2.- Gestión de usuarios
Dentro de la gestión de usuarios hay dos operaciones a realizar:

1. Autenticación
2. Registro de un nuevo usuario
3. Baja de un usuario
4. Modificación de parámetros del usuario
5. Cambio de contraseña
6. Petición de recuperación de contraseña

###2.0 - Modelo de usuario
El modelo de usuario de la base de datos tiene este esquema:

```


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
    city: {type: String, required: true},
    province: {type: String, required: true},
    country: {type: String, required: true},
    state: {type: Number, required: false},
    imageURL : {type: String, required:false},
    admin: {type: Boolean, required: false, default: false}

});

userSchema.index({'email':1},{ unique: true});
userSchema.index({'nick_name':1},{ unique: true});
userSchema.index({location: '2dsphere'});
``



###2.1 - Autenticación
<table>
<tr>
	<th> Método </th>
	<th> Ruta </th>
	<th> Parámetros en Body </th>
	<th> Respuesta </th>
	<th> Comentarios </th>
</tr>
<tr>
	<td bgcolor=#F99> POST </td>
	<td> /api/v1/users/authenticate </td>
	<td> 
		<li> user </li>
		<li> email </li>
		<li> password </li>
		<li> lan
	</td>
	<td>
	<li>OK:
	<br>
	{"sucess": true, "token": "xxxx"}
	<li>ERROR:
	<br>
	{"sucess": false, "error": "detalles del error"}
	</td>
	<td>
	El token se deberá utilizar en todas las peticiones
	a la API salvo en el registro de un usuario nuevo.<br>
	<li>lan: Permite elegir idioma "es" o "en"
	</td>
</tr>
</table>

###2.2 - Registro de usuario
<table>
<tr>
	<th> Método </th>
	<th> Ruta </th>
	<th> Parámetros en Body </th>
	<th> Respuesta </th>
	<th> Comentarios </th>
</tr>
<tr>
	<td bgcolor=#F99> POST </td>
	<td> /api/v1/users/register </td>
	<td> 
		<li> first_name </li>
		<li> last_name </li>
		<li> email </li>
		<li> user </li>
		<li> password </li>
		<li> password_repeat </li>
		<li> latitude </li>
		<li> longitude </li>
		<li> imageURL </li>
		<li> state </li>
	</td>
	<td>
	<li>OK:
	<br>
	{"sucess": true, "saved": JSON usuario creado}
	<li>ERROR:
	<br>
	{"sucess": false, "error": "detalles del error"}
	</td>
	<td>
	<li>lan: Permite elegir idioma "es" o "en"</li>
	Errores:
	<li>Usuario ya registrado
	<li>Email ya registrado
	<li>Parámetros de entrada erróneos
	</td>
</tr>
</table>


###2.3 - Baja de un usuario
<table>
<tr>
	<th> Método </th>
	<th> Ruta </th>
	<th> Parámetros en Body </th>
	<th> Respuesta </th>
	<th> Comentarios </th>
</tr>
<tr>
	<td bgcolor=#88F> DELETE </td>
	<td> /api/v1/users/:userid </td>
	<td> 
		<li> token (parámetro GET) </li>
	</td>
	<td>
	<li>OK:
	<br>
	{"sucess": true}
	<li>ERROR:
	<br>
	{"sucess": false, "error": "detalles del error"}
	</td>
	<td>
	<li>lan: Permite elegir idioma "es" o "en"</li>
	Errores:
	<li>Usuario sin permiso
	<li>Usuario no existe
	<li>Sólo el admin puede borrar otro usuario
	</td>
</tr>
</table>

###2.4 - Modificación de parámetros del usuario
<table>
<tr>
	<th> Método </th>
	<th> Ruta </th>
	<th> Parámetros en Body </th>
	<th> Respuesta </th>
	<th> Comentarios </th>
</tr>
<tr>
	<td bgcolor=#8F8>PUT</td>
	<td> /api/v1/users/:userid </td>
	<td> 
		<li> token (parámetro GET)</li>
	</td>
	<td>
	<li>OK:
	<br>
	{"sucess": true}
	<li>ERROR:
	<br>
	{"sucess": false, "error": "detalles del error"}
	</td>
	<td>
	<li>lan: Permite elegir idioma "es" o "en"</li>
	Errores:
	<li>Usuario sin permiso
	<li>Parámetros erróneo
	</td>
</tr>
</table>


###2.5 - Cambio de contraseña
<table>
<tr>
	<th> Método </th>
	<th> Ruta </th>
	<th> Parámetros en Body </th>
	<th> Respuesta </th>
	<th> Comentarios </th>
</tr>
<tr>
	<td bgcolor=#8F8>PUT</td>
	<td> /api/v1/users/password/:userid </td>
	<td> 
		<li> token (parámetro GET)</li>
		<li> old_pass </li>
		<li> new_pass </li>
		<li> new_pass_repeat</li>
	</td>
	<td>
	<li>OK:
	<br>
	{"sucess": true}
	<li>ERROR:
	<br>
	{"sucess": false, "error": "detalles del error"}
	</td>
	<td>
	<li>lan: Permite elegir idioma "es" o "en"</li>
	Errores:
	<li>Password inválido</li>
	<li>Parámetros erróneos</li>
	<li>Fallo de autenticación</li>
	<li>Los password no coinciden</li>
	<li>Usuario no existe</li>
	</td>
</tr>
</table>

###2.6 Recuperación de contraseña

<table>
<tr>
	<th> Método </th>
	<th> Ruta </th>
	<th> Parámetros en Body </th>
	<th> Respuesta </th>
	<th> Comentarios </th>
</tr>
<tr>
	<td bgcolor=#F99>POST</td>
	<td> /api/v1/users/recover </td>
	<td> 
		<li> user </li>
		<li> email </li>
	</td>
	<td>
	<li>OK:
	<br>
	{"sucess": true, "error": 'Enviado email a ....}
	<li>ERROR:
	<br>
	{"sucess": false, "error": "No se pudo enviar el mail"}
	</td>
	<td>
	<li>lan: Permite elegir idioma "es" o "en"</li>
	Errores:
	<li>Email no existe</li>
	<li>Parámetros erróneos</li>
	<li>Usuario no encontrado</li>
	</td>
</tr>
</table>

