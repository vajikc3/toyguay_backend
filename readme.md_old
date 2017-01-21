#Nodepop API#

##1.- Introducción##
En este documento se describe la funcionalidad de la API nodepop. Esta API tiene la utilidad de gestionar usuarios y anuncios de una base de datos


##2.- Gestión de usuarios
Dentro de la gestión de usuarios hay dos operaciones a realizar:

1. Autenticación
2. Registro de un nuevo usuario

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
	<td> /api/v1/usuarios/authenticate </td>
	<td> 
		<li> usuario </li>
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

###2.2 - Registro de un usuario nuevo
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
	<td> /api/v1/usuarios/register </td>
	<td> 
		<li> usuario </li>
		<li> email </li>
		<li> password </li>
		<li> lan </li>
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

##3.- Anuncios
En la primera fase de la API sólo está disponible el acceso a los anuncios sin la posibilidad de subir
<table>
<tr>
	<th> Método </th>
	<th> Ruta </th>
	<th> Parámetros GET </th>
	<th> Respuesta </th>
	<th> Comentarios </th>
</tr>
<tr>
	<td bgcolor=#9F9> GET </td>
	<td> /api/v1/anuncios? </td>
	<td> 
		<li> tag </li>
		<li> venta </li>
		<li> precio </li>
		<li> nombre </li>
		<li> start </li>
		<li> limit </li>
		<li> sort </li>
		<li> incluirTotal </li>
		<li> lan </li>
	</td>
	<td>
		<li>OK:
		<br>
		{"sucess": true,<br> total:num_reg,<br> "rows": Array JSON Anuncios}</li><br>
		<li>ERROR:
		<br>
		{"sucess": false, "error": "detalles del error"}</li>
	</td>
	<td>
	<li>lan: Permite elegir idioma "es" o "en"</li>
	<hr>
	<li>Precio fijo: "precio=XX"</li>
	<li>Precio mayor que XX: "precio=XX-"</li>
	<li>Precio menor que XX: "precio=-XX"</li>
	<li>Precio entre XX e YY: "precio=XX-YY"</li>
	<hr><li>venta: true para venta,false buscar</li>
	<li>tag: Se puede usar varias veces para buscar <br>artículos por varias etiquetas. Ejemplo: "tag=motor&tag=lifestyle"</li>
	<li>nombre: Nombre del artículo</li>
	<hr>
	<li> start: Indicar el número de registro desde<br> el que empezar </li>
	<li> limit: Número máximo de registro a devolver
	<li> sort: Indicar el campo por el que ordenar
	<li> incluirTotal: Si es 'true' devuelve el número de <br>
	registros devueltos dentro del JSON como 'total'
	<hr>
	Errores:
	<li>Si los parámetros de búsqueda tiene formato erróneo
	<li> Error de autenticación si no hay token o es erróneo</li>
	</td>
</table>
##4.- Imágenes
Permite recuperar las imágenes almacenadas de los productos
<table>
<tr>
	<th> Método </th>
	<th> Ruta </th>
	<th> Parámetros GET </th>
	<th> Respuesta </th>
	<th> Comentarios </th>
</tr>
<tr>
	<td bgcolor=#9F9> GET </td>
	<td> /api/v1/images/anuncios/<b>nombre_fichero </td>
	<td> 
		<li> lan </li>
	</td>
	<td>
		<li>OK:
		<br>
		Devuelve la imagen</li>
		<li>ERROR:
		<br>
		{"sucess": false, "error": "detalles del error"}</li>
	</td>
	<td>
	Errores:
	<li>Si el fichero de la imagen no existe </li>
	</td>
</table>


##5.- Tokens
Para permitir las notificaciones, el usuario puede enviar 'tokens'. 
<table>
<tr>
	<th> Método </th>
	<th> Ruta </th>
	<th> Parámetros en Body </th>
	<th> Respuesta </th>
	<th> Comentarios </th>
</tr>
<tr>
	<td bgcolor=#99F> POST </td>
	<td> /api/v1/tokens </td>
	<td> 
		<li>usuario</li>
		<li>plataforma</li>
		<li> token </li>
	</td>
	<td>
	<li>OK:
	<br>
	{"sucess": true, "token": JSON Token actualizado}
	<li>ERROR:
	<br>
	{"sucess": false, "error": "detalles del error"}
	</td>
	<td>
	<li>plataforma: 'ios' o 'android'</li>
	<li>usuario: Si el usuario requerido no tiene token se crea. Si tiene se actualiza</li>
	<li>token: Se puede pasar por GET o por POST. <br>Por POST tiene preferencia, por GET cogería el de autenticación.</li>
	<hr>
	Errores:
	<li> Parámetros de tokens enviado con formato erróneo</li>
	<li> Plataforma no válida </li>
	<li> Error de autenticación si no hay token o es erróneo</li>
	</td>
</tr>
</table>

##6.- Formatos JSON de los registros
Algunos peticiones de la API devuelven JSON a registros de la base de datos. Aquí se describen
###6.1 Usuarios

```
{
  "sucess": true,
  "saved": {
    "__v": 0,
    "name": "fernando",
    "email": "fernando@nodepop.es",
    "password": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
    "_id": "572bc16b8367ca100826ea71"
  }
}
```
###6.2 Anuncios
```
{
  "sucess": true,
  "total": 2,
  "rows": [
    {
      "_id": "57267140df484567109be4f3",
      "nombre": "Bicicleta",
      "venta": true,
      "precio": 230.15,
      "foto": "bici.jpg",
      "tags": [
        "lifestyle",
        "motor"
      ]
    },
    {
      "_id": "57267140df484567109be4f4",
      "nombre": "iPhone 3GS",
      "venta": false,
      "precio": 50,
      "foto": "iphone.png",
      "tags": [
        "lifestyle",
        "mobile"
      ]
    }
  ]
}
```
###6.3 Tokens
```
{
  "sucess": true,
  "token": {
    "_id": "572a712ed721338bad3d9b12",
    "user": "admin",
    "platform": "ios",
    "token": "eyJhbGciOiJIUzI1Ni...........",
    "__v": 0
  }
}
```
##Anexo
###Lenguajes
Todas las peticiones admiten el parámetro GET (lan=xx) donde el usuario puede pedir el idioma en el que se devolverán los errores. Los idiomas disponibles son:<br>
<li>"es": Español</li>
<li>"en": Inglés</li>

###Inicialización de la Base de datos
Se ha creado un script llamado ***install_bd.js*** que se utiliza para borrar la base de datos y crear la estructura con un usuario y dos anuncios (incluidos en *anuncios.json*). Para llamar al script se ha creado una entrada en el *package.json*:

```
npm run installBD
``` 
###Colecciones POSTMAN
Para la prueba de la API se han generado varias peticiones desde el software **Postman** de **Chrome**. En la siguiente carpeta se puede encontrar el fichero para importarlo:

```
doc
```
###Validación con JSHINT
Para la validación de código se ha utilizado la herramienta **jshint** con la siguiente configuración:

```
{
  "node": true,
  "esnext": true,
  "globals": {},
  "globalstrict": true,
  "quotmark": "single",
  "undef": true,
  "unused": true
}
```

 
