import { useParams } from "react-router-dom";

export function ReviewPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Nueva reseña</h1>
      <p>Para el libro con ID: {id}</p>
    </div>
  );
}
