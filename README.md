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

- [Acerca del proyecto](#🌟-acerca-del-proyecto)
- [Tecnologias](#👾-tecnologias)
- [Ejecutar localmente](#🧰-ejecutar-localmente)
- - [Prerequisitos](#‼️-prerequisitos)
- - [Ejecucion](#🏃-ejecucion)
- [Uso](#💻-uso)
- [Sobre mi](#🎓-sobre-mi)

## 🌟 Acerca del proyecto

![product-screenshot]

Ticksta es una single-page app (SPA) desarrollada como proyecto de juguete para demostrar conocimientos en el ecosistema de React/Node.js, tanto del lado del coding como del diseño de UI.

Consta de un CRUD para la gestión de proyectos y tickets que cuenta con autorización y autenticación.En el mismo pueden crearse proyectos y asignarseles usuarios, los cuales pueden crear tickets y
comunicarse con los desarrolladores asignados al mismo mediante mensajes.

### 👾 Tecnologias

Las principales tecnologías y librerías utilizadas son:

[![Node][node]][node-url]
[![React][react.js]][react-url]
[![Express][express]][react-url]
[![Docker][docker]][docker-url]
[![Bootstrap][bootstrap.com]][bootstrap-url]

Tambien se utilizan otras librerias mas pequeñas de Node y React como:

- Prisma ORM
- react-router-dom
- react-hook-form
- framer-motion
- joi
- jsonwebtoken
- axios

## 🧰 Ejecutar localmente

### ‼️ Prerequisitos

Es necesario tener instalado:

- [Npm](https://www.npmjs.com/)
- [Node.js](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)

### 🏃 Ejecucion

Descargar el archivo [docker-compose.yml](docker-compose.yml) que se encuentra en la
raiz del repositorio.

Ejecutar la terminal en la misma carpeta donde se encuentra el descargado y correr el siguiente comando:

```sh
docker-compose up
```

Una vez termine de descargar y compilar los archivos, se leerá el siguiente mensaje:

```sh
Server started on port 3001
```

Ya se puede ingresar a la app mediante un navegador desde la URL http://localhost:3001

Para eliminar la app y todos los archivos locales creados, ejecutar los siguientes comandos en la terminal:

```sh
docker-compose down
docker rmi ljvazquez/ticksta mysql
```

## 💻 Uso

- Para comenzar a utilizar la app, puede registrarse un nuevo usuario o seleccionar una cuenta de prueba.

![login]

- Los MANAGER pueden crear y editar proyectos, asi como asignarles DEVS y USUARIOS.

![manager-crear-editar-asignar-proyecto]

![manager-asignar-dev]

- Una vez asignados a un proyecto, los USUARIOS pueden crear tickets y responderlos.

![user-crear-responder-ticket]

- Los DEV asignados a un ticket pueden responderlos y cambiar su estado. Una vez cerrado,
  el ticket ya no recibirá mensajes nuevos.

![dev-responder-cambiar-estado-ticket]

![dev-responder-cambiar-estado-ticket-2]

- Los ADMIN pueden ver todos los recursos, y adicionalmente asignar roles a las cuentas
  registradas.

![admin-cambiar-roles]

## 🎓 Sobre mi

Mi nombre es Leandro, actualmente me encuentro cursando el ultimo año de la carrera de Desarrollo Web en la [Universidad Nacional de la Matanza](https://www.unlam.edu.ar/).
Poseo experiencia tanto en desarrollo como en testing.

- [Linkedin](https://www.linkedin.com/in/lvazquez-dev/)
- [Email](mailto:ljvazquez00@gmail.com)

[product-screenshot]: readme_assets/tickets_screenshot.png
[login-screenshot]: readme_assets/login.png
[admin-cambiar-roles]: readme_assets/admin-cambiar-roles.gif
[dev-responder-cambiar-estado-ticket]: readme_assets/dev-responder-cambiar-estado-ticket.gif
[dev-responder-cambiar-estado-ticket-2]: readme_assets/dev-responder-cambiar-estado-ticket-2.gif
[login]: readme_assets/login.gif
[manager-asignar-dev]: readme_assets/manager-asignar-dev.gif
[manager-crear-editar-asignar-proyecto]: readme_assets/manager-crear-editar-asignar-proyecto.gif
[user-crear-responder-ticket]: readme_assets/user-crear-responder-ticket.gif
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[bootstrap-url]: https://getbootstrap.com
[node]: https://img.shields.io/badge/Node-8fe3a7?style=for-the-badge&logo=nodedotjs
[node-url]: https://nodejs.org
[express]: https://img.shields.io/badge/Express.js-303e75?style=for-the-badge&logo=express
[express-url]: https://expressjs.org
[docker]: https://img.shields.io/badge/Docker-a1e1ff?style=for-the-badge&logo=docker
[docker-url]: https://www.docker.com/
