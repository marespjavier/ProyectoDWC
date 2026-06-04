import { BooksPage } from "./BooksPage.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

/*
  Página de inicio.
  En esta aplicación, el inicio muestra directamente el listado de libros.
*/

export function HomePage() {
  useDocumentTitle("LibCloud - Tu Biblioteca Digital");
  return <BooksPage />;
}
