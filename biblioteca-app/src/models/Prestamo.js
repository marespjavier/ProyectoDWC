/*
  Modelo Prestamo
*/

export class Prestamo {
  constructor(data) {
    this.id = Number(data?.id);

    /*
      Estado
    */
    this.estado = data?.estado ?? "activo";

    /*
      Fechas
    */
    this.fecha_prestamo = data?.fecha_prestamo ?? null;

    this.fecha_devolucion = data?.fecha_devolucion ?? null;

    /*
      Usuario relacionado
    */
    this.user = data?.user
      ? {
          id: data.user.id,
          nombre: data.user.nombre,
          avatar_url: data.user.avatar_url,
        }
      : null;

    /*
      Libro relacionado
    */
    this.libro = data?.libro
      ? {
          id: data.libro.id,
          titulo: data.libro.titulo,
        }
      : null;

    /*
      IDs
    */
    this.user_id = data?.user_id ?? null;

    this.libro_id = data?.libro_id ?? null;
  }
}
