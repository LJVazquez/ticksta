<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="readme_assets/logo.png" alt="Logo" height="50">
  </a>

  <p align="center">
    Mini proyecto fullstack.
    <br />
    <!-- <a href="https://github.com/othneildrew/Best-README-Template"><strong>Live demo</strong></a> -->
  </p>
</div>

## 📔 Tabla de contenidos

- [Acerca del proyecto](##acerca-del-proyecto)
- [Tecnologias](#tecnologias)
- [Ejecutar localmente](#ejecutar-localmente)
- - [Prerequisitos](#prerequisitos)
- - [Instalacion](#instalacion)
- - [Configuracion del entorno](#configuracion-del-entorno)
- - [Ejecucion](#ejecucion)
- [Uso](#uso)
- [Sobre mi](#sobre-mi)

## 🌟 Acerca del proyecto

[![Product Name Screen Shot][product-screenshot]](#)

Ticksta es una single-page app (SPA) desarrollada como proyecto de juguete para demostrar conocimientos en el ecosistema de React/Node.js, tanto del lado del coding como del diseño de UI.

Consta de un CRUD para la gestión de tickets que cuenta con autorización y autenticación, en el que los usuarios pueden crear dichos tickets y comunicarse con administradores mediante mensajes en los mismos.

### 👾 Tecnologias

Las principales librerias utilizadas son:

[![Node][node]][node-url]
[![React][react.js]][react-url]
[![Express][express]][react-url]
[![Bootstrap][bootstrap.com]][bootstrap-url]

Tambien se utilizan otras librerias mas pequeñas de Node y React como:

- Prisma ORM
- react-router-dom
- react-hook-form
- framer-motion
- joi
- jsonwebtoken
- axios

<!-- ## 🧰 Ejecutar localmente

### ‼️ Prerequisitos

Es necesario tener instalado:
-Node.js
-NPM
-Prisma CLI

### ⚙️ Instalacion

1. Clonar el repositorio.
   ```sh
   git clone https://github.com/LJVazquez/ticksta.git
   ```
2. Instalar paquetes de Node.
   ```sh
   npm install
   ```
3. Instalar CLI de Prisma ORM.
   ```sh
   npm install @prisma/client
   ```

### 🔑 Configuracion del entorno

- Renombrar el archivo .env.template de la carpeta back/ a .env
- Configurar el archivo .env con los datos de tu base de datos y tu codigo secreto para generar los hash de los passwords.

  ```sh
  DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
  TOKEN_SECRET=tu_clave_secreta

  ```

En la terminal:

- Ingresar a la carpeta de back.
  ```sh
  cd back
  ```
- Crear la estructura de la base de datos.
  ```sh
  npx prisma db push
  ```
- Ejecutar seeder de la base de datos.
  ```sh
  npx prisma db seed
  ```

### 🏃 Ejecucion

En la terminal:

- Ejecutar servidor.
  ```sh
  cd back
  cd npm start
  ```

En una nueva terminal:

- Ejecutar React.
  ```sh
  cd front
  cd npm start
  ```

## 🔧 Uso

Con el seeder se crean 2 cuentas de prueba:

#### ADMIN:

- email: admin@ticksta.com
- password: 123123123

#### USER:

- email: user@ticksta.com
- password: 123123123 -->

## 🎓 Sobre mi

Mi nombre es Leandro, actualmente me encuentro cursando el ultimo año de la carrera de Desarrollo Web en la [Universidad Nacional de la Matanza](https://www.unlam.edu.ar/).
Poseo experiencia tanto en desarrollo como en testing.

- [Linkedin](https://www.linkedin.com/in/lvazquez-dev/)
- [Email](mailto:ljvazquez00@gmail.com)

[product-screenshot]: readme_assets/tickets_screenshot.png
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[bootstrap-url]: https://getbootstrap.com
[node]: https://img.shields.io/badge/Node-8fe3a7?style=for-the-badge&logo=nodedotjs
[node-url]: https://nodejs.org
[express]: https://img.shields.io/badge/Express.js-303e75?style=for-the-badge&logo=express
[express-url]: https://expressjs.org
