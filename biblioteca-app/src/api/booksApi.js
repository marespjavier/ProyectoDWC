'use strict';
//URL base de la API (json-server en local) en fichero config API_URL
import { API_URL } from "./config.js";
//Importamos la clase Book para trabajar con ella
import { Book } from "../models/Book.js";


/*
  Función genérica para hacer peticiones HTTP.
  Centraliza fetch, manejo de errores y conversión a JSON.
*/
async function request(path, options) {
  const response = await fetch(path, options);

  let data = null;
  try {
    data = await response.json();
  } catch {
      // Si no hay JSON, dejamos data como null
  }

  if (!response.ok) {
    const message = data?.message || `Error HTTP ${response.status}`;
    throw new Error(message);
  }

  return data;
}

/*
  GET /books
  Obtiene la lista de libros del servidor
*/
export async function getBooks() {
  const data = await request(`${API_URL}/books`);
  //utilizando la clase Book
  return data.map((b) => new Book(b));
}


/*
  GET /books/:id
  Obtiene el libro con la id especificada
*/
export async function getBookById(id) {
    const data = await request(`${API_URL}/books/${id}`);
    //utilizando la clase Book
    return new Book(data);
}

/*
  POST /books
  Crea un nuevo libro en el servidor
*/
export async function createBook(book) {
  const data = await request(`${API_URL}/books`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(book),
  });
  return new Book(data);
}

/*
  PATCH /books/:id
  Modifica solo algunos campos de un libro existente.
*/
export async function updateBook(id,book) {
  const data = await request(`${API_URL}/books/${id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(book),
  })
  return new Book(data);
}

/*
  DELETE /books/:id
  Borra un libro del servidor.
*/
export function deleteBook(id) {
  return request(`${API_URL}/books/${id}`, { 
      method: "DELETE" 
    });
}

/*
  GET /reviews?bookId=:bookId
  Obtiene las reseñas asociadas a un libro  
*/
export function getReviewsByBookId(bookId) {
    return request(`${API_URL}/reviews?bookId=${bookId}`);
}

/*
  POST /reviews
  Creación de una reseña para un libro
*/
export async function createReview(review) {
    //review ejemplo: { bookId, user, rating, text, createdAt}
    return request(`${API_URL}/reviews`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(review),
    });
}