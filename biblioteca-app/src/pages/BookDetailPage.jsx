import { useParams } from "react-router-dom";

export function BookDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Detalle del libro</h1>
      <p>ID: {id}</p>
    </div>
  );
}
