import { API_URL } from "./config.js";

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.mensaje || data?.message || `Error HTTP ${response.status}`,
    );
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Obtener todas las reseñas
|--------------------------------------------------------------------------
*/

export async function getReviews() {
  return request(`${API_URL}/review`);
}

/*
|--------------------------------------------------------------------------
| Obtener reseñas por libro
|--------------------------------------------------------------------------
*/

export async function getReviewsByBookId(bookId) {
  const reviews = await getReviews();

  return reviews.filter(
    (review) => Number(review.libro?.id) === Number(bookId),
  );
}

/*
|--------------------------------------------------------------------------
| Crear reseña
|--------------------------------------------------------------------------
*/

export async function createReview(review) {
  return request(`${API_URL}/review`, {
    method: "POST",
    body: JSON.stringify(review),
  });
}
