import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ShelfContext = createContext(null);

const VALID_STATUSES = new Set(["favorito", "pendiente", "leido"]);

/*
|--------------------------------------------------------------------------
| Storage dinámico por usuario
|--------------------------------------------------------------------------
*/

function getStorageKey() {
  const user = JSON.parse(localStorage.getItem("user"));

  return `shelf_${user?.id ?? "guest"}`;
}

/*
|--------------------------------------------------------------------------
| Fecha actual
|--------------------------------------------------------------------------
*/

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/*
|--------------------------------------------------------------------------
| Cargar estantería
|--------------------------------------------------------------------------
*/

function loadShelf() {
  try {
    const raw = localStorage.getItem(getStorageKey());

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    /*
    |--------------------------------------------------------------------------
    | Limpieza básica
    |--------------------------------------------------------------------------
    */

    return parsed
      .filter(
        (x) => typeof x?.bookId === "number" && VALID_STATUSES.has(x?.status),
      )

      .map((x) => ({
        bookId: x.bookId,

        status: x.status,

        addedAt: typeof x.addedAt === "string" ? x.addedAt : todayISO(),
      }));
  } catch {
    return [];
  }
}

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
*/

export function ShelfProvider({ children }) {
  const [items, setItems] = useState(() => loadShelf());

  /*
  |--------------------------------------------------------------------------
  | Guardar en localStorage
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    localStorage.setItem(getStorageKey(), JSON.stringify(items));
  }, [items]);

  /*
  |--------------------------------------------------------------------------
  | Añadir / actualizar
  |--------------------------------------------------------------------------
  */

  function upsert(bookId, status = "pendiente") {
    if (!VALID_STATUSES.has(status)) {
      status = "pendiente";
    }

    setItems((prev) => {
      const idx = prev.findIndex((x) => x.bookId === bookId);

      /*
      |--------------------------------------------------------------------------
      | Nuevo
      |--------------------------------------------------------------------------
      */

      if (idx === -1) {
        return [
          ...prev,
          {
            bookId,

            status,

            addedAt: todayISO(),
          },
        ];
      }

      /*
      |--------------------------------------------------------------------------
      | Actualizar existente
      |--------------------------------------------------------------------------
      */

      const updated = [...prev];

      updated[idx] = {
        ...updated[idx],

        status,
      };

      return updated;
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Eliminar
  |--------------------------------------------------------------------------
  */

  function remove(bookId) {
    setItems((prev) => prev.filter((x) => x.bookId !== bookId));
  }

  /*
  |--------------------------------------------------------------------------
  | Cambiar estado
  |--------------------------------------------------------------------------
  */

  function setStatus(bookId, status) {
    upsert(bookId, status);
  }

  /*
  |--------------------------------------------------------------------------
  | Obtener estado
  |--------------------------------------------------------------------------
  */

  function getStatus(bookId) {
    return items.find((x) => x.bookId === bookId)?.status ?? null;
  }

  /*
  |--------------------------------------------------------------------------
  | Existe en estantería
  |--------------------------------------------------------------------------
  */

  function isInShelf(bookId) {
    return items.some((x) => x.bookId === bookId);
  }

  /*
  |--------------------------------------------------------------------------
  | Context value
  |--------------------------------------------------------------------------
  */

  const value = useMemo(
    () => ({
      items,

      upsert,

      remove,

      setStatus,

      getStatus,

      isInShelf,
    }),
    [items],
  );

  return (
    <ShelfContext.Provider value={value}>{children}</ShelfContext.Provider>
  );
}

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export function useShelf() {
  const ctx = useContext(ShelfContext);

  if (!ctx) {
    throw new Error("useShelf debe usarse dentro de <ShelfProvider>");
  }

  return ctx;
}
