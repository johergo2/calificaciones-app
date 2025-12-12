import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import EventosPage from "./pages/EventosPage";
import ParticipanPage from "./pages/ParticipanPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/eventos" element={<EventosPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/participantes" element={<ParticipanPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
