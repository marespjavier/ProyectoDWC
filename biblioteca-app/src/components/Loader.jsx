export function Loader({ text = "Cargando..." }) {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>

      <p>{text}</p>
    </div>
  );
}
