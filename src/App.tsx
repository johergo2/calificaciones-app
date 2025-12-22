import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import EventosPage from "./pages/EventosPage";
import CategoriasPage from "./pages/CategoriasPage";
import ParticipanPage from "./pages/ParticipanPage";
import AsignarCategoriasPage from "./pages/AsignarCategoriasPage";
import AsignarParticipantesPage from "./pages/AsignarParticipantesCategoriasPage";
import JuradosPage from "./pages/JuradosPage";
import AsignarJuradosPage from "./pages/AsignarJuradosCategoriasPage";
import CalificacionesPage from "./pages/CalificacionesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/eventos" element={<EventosPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/participantes" element={<ParticipanPage />} />
        <Route path="/asignarcategorias" element={<AsignarCategoriasPage />} />
        <Route path="/asignarParticipantes" element={<AsignarParticipantesPage />} />
        <Route path="/jurados" element={<JuradosPage />} />
        <Route path="/asignarJurados" element={<AsignarJuradosPage />} />
        <Route path="/calificaciones" element={<CalificacionesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
