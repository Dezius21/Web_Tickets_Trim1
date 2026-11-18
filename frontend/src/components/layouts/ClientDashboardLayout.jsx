import ClientDashboardHeader from "../ClientDashboardHeader";
import ClientMainPanel from "../ClientDashboardMainPanel";
import ClientSidePanel from "../ClientDashboardSidePanel";

export default function ClientDashboardLayout({
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

      <ClientDashboardHeader userName={userName} onLogout={onLogout} />

      <main id="contenido" className="dashboard-body">
        <ClientMainPanel action={action} placeholder={placeholder}>
          {children}
        </ClientMainPanel>
        <ClientSidePanel title={sidebarTitle}>{sidebar}</ClientSidePanel>
      </main>
    </div>
  );
}