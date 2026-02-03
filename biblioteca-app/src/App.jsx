import { Routes, Route, NavLink } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { NewBookPage } from "./components/NewBookPage";
import { EditBookPage } from "./components/EditBookPage";
import { BookDetailPage } from "./components/BookDetailPage";
import { ShelfPage } from "./components/ShelfPage";
import { ReviewPage } from "./components/ReviewPage";
import { NotFoundPage } from "./components/NotFoundPage";


function App() {
  return (
    <> 
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Inicio
        </NavLink>
        <NavLink to="/shelf" className={({ isActive }) => (isActive ? "active" : "")}>
          Mi estantería
        </NavLink>
        <NavLink to="/books/new" className={({isActive}) => (isActive ? "active": "")}>
          Añadir libro
        </NavLink>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/new" element={<NewBookPage/>} />
          <Route path="/book/:id/edit" element={<EditBookPage />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
          <Route path="/book/:id/review" element={<ReviewPage />} />
          <Route path="/shelf" element={<ShelfPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
