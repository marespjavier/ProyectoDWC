import { BookCard } from "./BookCard";

/*
  Componente de lista.
  Recibe un array de libros y pinta una rejilla de BookCard.
*/
export function BookList({ books }) {
  return (
    <div className="grid">
      {books.map((b) => (
        <BookCard key={b.id} book={b} />
      ))}
    </div>
  );
}
