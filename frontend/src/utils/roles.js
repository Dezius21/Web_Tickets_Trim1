// Valores EXACTOS que guarda el backend en users.model.js
export const ROLES = {
  cliente: "Inquilino",
  trabajador: "Contratista",
  admin: "Administrador",
};

// A dónde mandamos a cada rol justo después de entrar
export function rutaInicio(role) {
  switch (role) {
    case ROLES.cliente:
      return "/cuenta/tickets";
    case ROLES.trabajador:
      return "/soporte/tickets";
    case ROLES.admin:
      return "/admin/tickets";
    default:
      return "/";
  }
}