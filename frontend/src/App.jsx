import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register  from "./components/pages/Register";
import RutaProtegida from "./components/ProtectedRoute";
import { ROLES } from "./utils/roles";

import ClientDashboardPreview from "./components/pages/ClientDashboard";
import WorkerDashboardPreview from "./components/pages/WorkerDashboard";
import AdminDashboardPreview from "./components/pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas con navbar y footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register  />} />

          <Route path="/403" element={<h1>Acceso denegado</h1>} />
          <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Route>

        {/* Dashboards: llevan su propio header, por eso van fuera del Layout */}
        <Route element={<RutaProtegida roles={[ROLES.cliente]} />}>
          <Route path="/cuenta/tickets" element={<ClientDashboardPreview />} />
        </Route>
        <Route element={<RutaProtegida roles={[ROLES.trabajador]} />}>
          <Route path="/soporte/tickets" element={<WorkerDashboardPreview />} />
        </Route>
        <Route element={<RutaProtegida roles={[ROLES.admin]} />}>
          <Route path="/admin/tickets" element={<AdminDashboardPreview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}