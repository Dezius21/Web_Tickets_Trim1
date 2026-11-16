import Button from "./Button";

export default function ClientDashboardHeader({ userName, onLogout }) {
  return (
    <header className="dashboard-header">
      <span className="dashboard-logo">Nombreee</span>
      <span className="dashboard-user">{userName}</span>
      <Button variant="secondary" onClick={onLogout}>Cerrar sesión</Button>
    </header>
  );
}