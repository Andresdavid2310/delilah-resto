# Backend "Delilah Restó"

Proyecto #3 del curso de Desarrollo Web Full Stack de Acámica.

## Recursos y tecnologías utilizadas

- Node.js
- Nodemon
- Express
- JWT
- MySQL
- Sequelize
- Postman 
- Swagger
- Morgan
- Babel
- XAMPP

El objetivo de este proyecto es crear el backend de una app de comida llamada Delilah Restó

## Documentación de la API

Abrir el archivo `DelilahRestoAPI-1.0.0.yaml` E importar su contenido en [Swagger](https://editor.swagger.io/) 
se mostrarán los endpoint y la documentacion necesaria para utilizar la API

## Instalación e inicializacion del proyecto

### 1 - Clonar proyecto

Clonar el repositorio desde el [siguiente link](https://github.com/Andresdavid2310/delilah-resto.git)

Desde la consola con el siguiente link:

`git clone https://github.com/Andresdavid2310/delilah-resto.git`

### 2 - Instalación de dependencias

```
npm install
```

### 3 - Creando base de datos

- Abrir XAMPP y asegurarse que el puerto sobre el cual se está ejecutando es el `3306`
- Inicializar los servicios de Apache y MySQL
- Abrir el panel de control del servicio MySQL [siguiente link] http://localhost/phpmyadmin/
- importar el archivo en `/database/database.sql` 

### 4 - Iniciando el servidor

abrir desde el visual studio code o cualquier editor una consola
-Ejecutar el siguiente comando:
  - npm run dev

### 5 - Listo para usar!

Testear los endpoints provistos desde postman para poder hacer uso de la API ,

Se debe importar el [Colección de Postman]: (Delilah-Resto.postman_collection) ubicado en la raiz del proyecto