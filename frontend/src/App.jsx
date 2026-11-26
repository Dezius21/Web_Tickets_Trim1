import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register  from "./components/pages/Register";
import RutaProtegida from "./components/ProtectedRoute";
import { ROLES } from "./utils/roles";

import ClientDashboardPreview from "./components/pages/ClientDashboardPreview";
import WorkerDashboardPreview from "./components/pages/WorkerDashboardPreview";
import AdminDashboardPreview from "./components/pages/AdminDashboardPreview";

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

        {/* Dashboards: llevan su propio header, por eso van fuera del Layout.
            Temporal: siguen usando datos de ejemplo hasta conectar los tickets. */}
        <Route element={<RutaProtegida roles={[ROLES.cliente]} />}>
          <Route path="/cuenta/tickets" element={<ClientDashboardPreview />} />
        </Route>
        <Route element={<RutaProtegida roles={[ROLES.trabajador]} />}>
          <Route path="/soporte/tickets" element={<WorkerDashboardPreview />} />
        </Route>
        <Route element={<RutaProtegida roles={[ROLES.admin]} />}>
          <Route path="/admin/tickets" element={<AdminDashboardPreview />} />
        </Route>

        {/* Demos sin login, para seguir maquetando */}
        <Route path="/demo-cliente" element={<ClientDashboardPreview />} />
        <Route path="/demo-trabajador" element={<WorkerDashboardPreview />} />
        <Route path="/demo-admin" element={<AdminDashboardPreview />} />
      </Routes>
    </BrowserRouter>
  );
}