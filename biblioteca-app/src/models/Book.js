/*
  Modelo Book.
  Centraliza pequeñas transformaciones y getters para mostrar datos en la UI.
*/

export class Book {
  constructor(data) {
    this.id = Number(data?.id)

    /*
      Datos principales
    */
    this.title = data?.titulo ?? "Sin título"

    this.description = data?.descripcion ?? ""

    this.isbn = data?.isbn ?? "—"

    this.publishedYear = data?.anyo_publicacion ?? "—"

    /*
      IDs relaciones Laravel
    */
    this.autor_id = data?.autor_id ?? null

    this.categoria_id = data?.categoria_id ?? null

    /*
      Autor relacionado
    */
    this.author = data?.autor
      ? `${data.autor.nombre} ${data.autor.apellido}`
      : "Desconocido"

    /*
      Categoría relacionada
    */
    this.category = data?.categoria?.nombre ?? "Sin categoría"

    /*
     Disponibilidad del libro
    */
    this.disponible = data?.disponible ?? true

    /*
  Imagen portada
*/
    this.image = data?.imagen_url ?? null
  }

  /*
    Getter para año
  */
  get yearText() {
    return this.publishedYear ?? "—"
  }

  /*
    Acorta descripción
  */
  shortDescription(max = 140) {
    const text = this.description.trim()

    if (!text) {
      return "Sin descripción."
    }

    return text.length > max ? text.slice(0, max) + "…" : text
  }

  /*
    Método útil para filtros/búsqueda
  */
  matchesQuery(q) {
    const query = (q ?? "").trim().toLowerCase()

    if (!query) return true

    return (
      this.title.toLowerCase().includes(query) ||
      this.author.toLowerCase().includes(query) ||
      this.category.toLowerCase().includes(query)
    )
  }
}
