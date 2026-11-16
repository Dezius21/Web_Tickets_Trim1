import DashboardHeader from "../DashboardHeader";
import MainPanel from "../DashboardMainPanel";
import SidePanel from "../DashboardSidePanel";

export default function DashboardLayout({
  userName,
  onLogout,
  action,         
  placeholder,    
  sidebarTitle,   
  sidebar,        
  children,       
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