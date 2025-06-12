# Descripción

Example Shop V 1.0

## Correr en dev
1. Clonar el repositorio
2. Crear una copia del archivo ```.env.template``` y renombrarlo a ```.env``` y cambiar las variables de entorno.
3. Instalar las dependencias con `npm install` o `yarn install`
4. Levantar la base de datos ```docker-compose up -d```
5. Correr las migraciones de Prisma ```npx prisma migrate dev```
6. Ejecutar seed ```npm run seed```
7. Correr el proyecto con `npm run dev` o `yarn dev`


## Detener proceso si algun puerto (eg.:5432) está en uso
1. En PowerShell: ```netstat -aon | findstr :5432```
2. Luego busca el PID (última columna) y detén el proceso con: ```Stop-Process -Id <PID> -Force```