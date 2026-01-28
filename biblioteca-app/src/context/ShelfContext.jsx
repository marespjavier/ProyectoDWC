import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ShelfContext = createContext(null);

const STORAGE_KEY = "shelf";
const VALID_STATUSES = new Set(["favorito", "pendiente", "leido"]);

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function loadShelf() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // limpieza básica por si hay basura
    return parsed
      .filter((x) => typeof x?.bookId === "number" && VALID_STATUSES.has(x?.status))
      .map((x) => ({
        bookId: x.bookId,
        status: x.status,
        addedAt: typeof x.addedAt === "string" ? x.addedAt : todayISO(),
      }));
  } catch {
    return [];
  }
}

export function ShelfProvider({ children }) {
  const [items, setItems] = useState(() => loadShelf());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function upsert(bookId, status = "pendiente") {
    if (!VALID_STATUSES.has(status)) status = "pendiente";

    setItems((prev) => {
      const idx = prev.findIndex((x) => x.bookId === bookId);
      if (idx === -1) {
        return [...prev, { bookId, status, addedAt: todayISO() }];
      }
      const updated = [...prev];
      updated[idx] = { ...updated[idx], status };
      return updated;
    });
  }

  function remove(bookId) {
    setItems((prev) => prev.filter((x) => x.bookId !== bookId));
  }

  function setStatus(bookId, status) {
    upsert(bookId, status);
  }

  function getStatus(bookId) {
    return items.find((x) => x.bookId === bookId)?.status ?? null;
  }

  function isInShelf(bookId) {
    return items.some((x) => x.bookId === bookId);
  }

  const value = useMemo(
    () => ({ items, upsert, remove, setStatus, getStatus, isInShelf }),
    [items]
  );

  return <ShelfContext.Provider value={value}>{children}</ShelfContext.Provider>;
}

export function useShelf() {
  const ctx = useContext(ShelfContext);
  if (!ctx) throw new Error("useShelf debe usarse dentro de <ShelfProvider>");
  return ctx;
}
