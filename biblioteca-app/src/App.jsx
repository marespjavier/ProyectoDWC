import { Routes, Route, Link } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { BookDetailPage } from "./pages/BookDetailPage";
import { ShelfPage } from "./pages/ShelfPage";
import { ReviewPage } from "./pages/ReviewPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <div>
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/">Inicio</Link>
        <Link to="/shelf">Mi estantería</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:id" element={<BookDetailPage />} />
        <Route path="/book/:id/review" element={<ReviewPage />} />
        <Route path="/shelf" element={<ShelfPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
