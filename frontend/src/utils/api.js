// Único sitio desde el que el front habla con el backend.
// Cualquier componente que necesite datos hace: await api("/ruta", { method, body })
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status; // código HTTP (0 = no hay conexión con el servidor)
    this.errors = errors; // errores por campo que manda validate.middleware: { email: "...", ... }
  }
}

// AuthContext registra aquí su función logout para que api() pueda llamarla
// cuando el backend diga que el token ya no vale (401).
let alCaducarSesion = null;
export function setAlCaducarSesion(x) {
  alCaducarSesion = x;
}

// auth: false se usa en login y registro (todavía no hay token que mandar)
export async function api(ruta, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${ruta}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor.", 0);
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401 && auth) alCaducarSesion?.();
    throw new ApiError(data?.message || "Ha ocurrido un error.", res.status, data?.errors);
  }

  return data;
}