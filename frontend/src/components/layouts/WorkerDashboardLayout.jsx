import WorkerDashboardHeader from "../WorkerDashboardHeader";
import WorkerMainPanel from "../WorkerDashBoardMainPanel";
import WorkerSidePanel from "../WorkerDashboardSidePanel";

export default function WorkerDashboardLayout({
  userName,
  onLogout,
  headerActions,  // botones extra en la cabecera
  action,         
  placeholder,    
  sidebarTitle,   
  sidebar,        
  children,       
}) {
  return (
    <div className="dashboard dashboard-worker">
      <a href="#contenido" className="skip">Saltar al contenido</a>

      <WorkerDashboardHeader userName={userName} onLogout={onLogout} actions={headerActions} />

      <main id="contenido" className="dashboard-body">
        <WorkerMainPanel action={action} placeholder={placeholder}>
          {children}
        </WorkerMainPanel>
        <WorkerSidePanel title={sidebarTitle}>{sidebar}</WorkerSidePanel>
      </main>
    </div>
  );
}