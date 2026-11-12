import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Registro from "./components/pages/Registro";
import RutaProtegida from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route element={<RutaProtegida roles={["cliente"]} />}>
            <Route path="/cuenta/tickets" element={<h1>Mis tickets</h1>} />
          </Route>

          <Route element={<RutaProtegida roles={["agente"]} />}>
            <Route path="/soporte/tickets" element={<h1>Tickets asignados</h1>} />
          </Route>

          <Route path="/403" element={<h1>Acceso denegado</h1>} />
          <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}