import WorkerDashboardHeader from "../WorkerDashboardHeader";
import WorkerMainPanel from "../WorkerDashboardMainPanel";
import WorkerSidePanel from "../WorkerDashboardSidePanel";

export default function WorkerDashboardLayout({
  userName,
  onLogout,
  action,         
  placeholder,    
  sidebarTitle,   
  sidebar,        
  children,       
}) {
  return (
    <div className="dashboard dashboard-worker">
      <a href="#contenido" className="skip">Saltar al contenido</a>

      <WorkerDashboardHeader userName={userName} onLogout={onLogout} />

      <main id="contenido" className="dashboard-body">
        <WorkerMainPanel action={action} placeholder={placeholder}>
          {children}
        </WorkerMainPanel>
        <WorkerSidePanel title={sidebarTitle}>{sidebar}</WorkerSidePanel>
      </main>
    </div>
  );
}