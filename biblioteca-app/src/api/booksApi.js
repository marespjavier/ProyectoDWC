'use strict';

import { API_URL } from "./config.js";

//Función helper para url y opciones
async function fetchJson(url, options) {
  const response = await fetch(url, options);

  let data = null;
  try {
    data = await response.json();
  } catch {
    // puede venir vacío en algunos casos
  }

  if (!response.ok) {
    const message = data?.message || `Error HTTP ${response.status}`;
    throw new Error(message);
  }

  return data;
}

//Obtener libros
export async function getBooks() {
    return fetchJson(`${API_URL}/books`);
}

//Obtener libro por ID
export async function getBookById(id) {
    return fetchJson(`${API_URL}/books/${id}`);
}

//Obtener reseña por ID de libro
export async function getReviewsByBookId(bookId) {
    return fetchJson(`${API_URL}/reviews?bookId=${bookId}`);
}

//Crear una reseña
export async function createReview(review) {
    //review ejemplo: { bookId, user, rating, text, createdAt}
    return fetchJson(`${API_URL}/reviews`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(review),
    });
}