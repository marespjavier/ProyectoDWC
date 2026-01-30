# Biblioteca API (json-server)

Este proyecto utiliza **json-server** para crear una API REST falsa de forma rápida, ideal para pruebas y desarrollo frontend.
API simulada para uso en entorno de desarrollo, utilizada como backend del proyecto Biblioteca Online.


---

## Creación del proyecto

```bash
mkdir biblioteca-api
cd biblioteca-api
npm init -y
npm i json-server@0.17.4
```
---

## Configuración

Edita el archivo `package.json` y deja la sección `"scripts"` de la siguiente forma:
```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "json-server --watch db.json --port 3001 --delay 600"
  }
```
---

## Ejecución del servidor

Para arrancar la API ejecuta:

```bash
npm start
```

La API estará disponible en:

```arduino
http://localhost:3001
```

## Base de datos

Crea un archivo llamado `db.json` en la raíz del proyecto y define en él los datos que quieras exponer como API REST.

Ejemplo:

```json
{
  "books": [
    {
      "id": 1,
      "title": "Clean Code",
      "authors": [
        "Robert C. Martin"
      ],
      "description": "Un manual de buenas prácticas para escribir código limpio, legible y fácil de mantener.",
      "genres": [
        "Programación",
        "Ingeniería de Software"
      ],
      "publishedYear": 2008,
      "pages": 464,
      "language": "Inglés",
      "coverUrl": "https://covers.openlibrary.org/b/id/9641651-L.jpg",
      "available": true
    }
  ]
} 
```
Cada clave del objeto (`books`, en este caso) se convierte automáticamente en un endpoint REST.

## Endpoints disponibles

- GET /books
- GET /books/:id
- GET /reviews
- GET /reviews?bookId=:id
- POST /reviews
