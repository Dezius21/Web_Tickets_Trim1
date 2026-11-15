import Button from "../Button";
import DashboardLayout from "../layouts/DashboardLayout";

export default function DashboardPreview() {
  return (
    <DashboardLayout
      userName="Carlos Deza"
      onLogout={() => alert("Aquí se cerrará la sesión")}
      action={<Button>+ Nuevo ticket</Button>}
      sidebarTitle="Historial"
      sidebar={
        <>
          {Array.from({ length: 25 }, (_, i) => (
            <p key={i}>Elemento {i + 1}</p>
          ))}
        </>
      }
    >
      {/* panel izquierdo en blanco */}
    </DashboardLayout>
  );
}