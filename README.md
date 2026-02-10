# Biblioteca Online – Proyecto React

Proyecto desarrollado en React como trabajo final de la asignatura  
**Desarrollo de Aplicaciones Web en Entorno Cliente**.

La aplicación consiste en una **biblioteca online** que permite gestionar un
catálogo de libros, añadir reseñas y mantener una estantería personal del usuario.

El proyecto está dividido en dos partes:
- **biblioteca-api** → API REST simulada con json-server
- **biblioteca-app** → Aplicación frontend desarrollada con React y Vite

---

## Descripción del proyecto

La Biblioteca Online permite:

- Visualizar un listado de libros obtenidos desde una API REST simulada
- Buscar, filtrar y ordenar libros
- Acceder al detalle completo de cada libro
- Crear, editar y eliminar libros
- Añadir reseñas con validación de datos
- Gestionar una estantería personal (pendiente, leído, favorito)
- Persistir el estado de la estantería usando **localStorage**
- Navegar por la aplicación mediante **rutas dinámicas** (React Router)

---

## Tecnologías utilizadas

### Frontend
- React
- Vite
- JavaScript (ES6+)
- React Router
- HTML5
- CSS3

### Backend (simulado)
- Node.js
- json-server

---

## Estructura del proyecto

```text
ProyectoDWC/
├── biblioteca-api/
│   ├── db.json
│   └── package.json
├── biblioteca-app/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── context/
│   │   ├── models/
│   │   └── styles.css
│   └── package.json
└── README.md
```


## Instrucciones de ejecución

### 1. Clonar el repositorio

git clone <url-del-repositorio>
cd ProyectoDWC

---

### 2. Ejecutar la API (json-server)

cd biblioteca-api
npm install
npm start

La API se ejecutará en:
http://localhost:3001

---

### 3. Ejecutar la aplicación React

cd biblioteca-app
npm install
npm run dev

La aplicación estará disponible en:
http://localhost:5173

---

## API – Endpoints principales

- GET /books
- POST /books
- PATCH /books/:id
- DELETE /books/:id
- GET /books/:id
- GET /reviews
- GET /reviews?bookId=:bookId
- POST /reviews

---

## Decisiones técnicas destacadas

- Uso de hooks personalizados para separar la lógica de negocio de la interfaz
- Centralización de las peticiones HTTP en una capa api
- Uso de Context + localStorage para la estantería personal del usuario
- Validación de datos en formularios
- Confirmación de acciones críticas como la eliminación de libros

---

## Autor

Javier Martínez Espinosa
