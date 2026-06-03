"use strict";

import { API_URL } from "./config.js";
import { Book } from "../models/Book.js";

/*
  Función genérica para hacer peticiones HTTP.
*/
async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    // respuesta vacía
  }

  if (!response.ok) {
    const message =
      data?.message || data?.mensaje || `Error HTTP ${response.status}`;

    throw new Error(message);
  }

  return data;
}

/*
  GET libros
*/
export async function getBooks() {
  const response = await request(`${API_URL}/libro`);

  const books = response.data ?? response;

  return books.map((b) => new Book(b));
}

/*
  GET libro por ID
*/
export async function getBookById(id) {
  const response = await request(`${API_URL}/libro/${id}`);

  return new Book(response.data);
}

/*
  Crear libro
*/
export async function createBook(book) {
  const response = await request(`${API_URL}/libro`, {
    method: "POST",
    body: JSON.stringify(book),
  });

  return new Book(response.data);
}

/*
  Actualizar libro
*/
export async function updateBook(id, book) {
  const response = await request(`${API_URL}/libro/${id}`, {
    method: "PUT",
    body: JSON.stringify(book),
  });

  return new Book(response.data);
}

/*
  Eliminar libro
*/
export async function deleteBook(id) {
  return request(`${API_URL}/libro/${id}`, {
    method: "DELETE",
  });
}