export class Book {
  constructor(data) {
    this.id = Number(data?.id);
    this.title = data?.title ?? "Sin título";
    this.authors = Array.isArray(data?.authors) ? data.authors : [];
    this.description = data?.description ?? "";
    this.genres = Array.isArray(data?.genres) ? data.genres : [];
    this.publishedYear = data?.publishedYear ?? null;
    this.pages = data?.pages ?? null;
    this.language = data?.language ?? "—";
    this.coverUrl = data?.coverUrl ?? "";
    this.available = Boolean(data?.available);
  }

  //Métodos / getters
  get authorsText() {
    return this.authors.length ? this.authors.join(", ") : "Desconocido";
  }

  get yearText() {
    return this.publishedYear ?? "—";
  }

  get genresText() {
    return this.genres.length ? this.genres.join(" · ") : "—";
  }

  get availabilityText() {
    return this.available ? "Disponible" : "No disponible";
  }

  shortDescription(max = 140) {
    const text = this.description.trim();
    if (!text) return "Sin descripción.";
    return text.length > max ? text.slice(0, max) + "…" : text;
  }

  //Método útil para filtros/búsqueda
  matchesQuery(q) {
    const query = (q ?? "").trim().toLowerCase();
    if (!query) return true;

    const title = this.title.toLowerCase();
    const authors = this.authorsText.toLowerCase();
    return title.includes(query) || authors.includes(query);
  }
}
