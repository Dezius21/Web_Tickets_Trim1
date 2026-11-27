import Button from "./Button";

export default function WorkerDashboardHeader({ userName, onLogout, actions }) {
  return (
    <header className="dashboard-header">
      <span className="dashboard-logo">Nombreee</span>
      <span className="dashboard-user">{userName}</span>
      <div className="dashboard-header-actions">
        {actions}
        <Button variant="secondary" onClick={onLogout}>Cerrar sesión</Button>
      </div>
    </header>
  );
}