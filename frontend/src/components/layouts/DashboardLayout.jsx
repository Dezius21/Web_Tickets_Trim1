import DashboardHeader from "../DashboardHeader";
import MainPanel from "../DashboardMainPanel";
import SidePanel from "../DashboardSidePanel";

export default function DashboardLayout({
  userName,
  onLogout,
  action,         // botón de la esquina del panel izquierdo (opcional)
  placeholder,    // texto del centro del panel izquierdo cuando está vacío
  sidebarTitle,   // título del panel derecho
  sidebar,        // contenido del panel derecho
  children,       // contenido del panel izquierdo
}) {
  return (
    <div className="dashboard">
      <a href="#contenido" className="skip">Saltar al contenido</a>

      <DashboardHeader userName={userName} onLogout={onLogout} />

      <main id="contenido" className="dashboard-body">
        <MainPanel action={action} placeholder={placeholder}>
          {children}
        </MainPanel>
        <SidePanel title={sidebarTitle}>{sidebar}</SidePanel>
      </main>
    </div>
  );
}