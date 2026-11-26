import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, setAlCaducarSesion } from "../utils/api";

// El backend aún tiene las rutas de auth bajo /test. Cuando las muevan, solo hay que cambiar estas dos líneas.
const RUTA_LOGIN = "/users/login";
const RUTA_REGISTER = "/users/register";

const AuthContext = createContext(null);

// Al abrir la web (o recargar con F5) recuperamos la sesión guardada
function leerSesion() {
  try {
    const token = localsorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    return token && user ? user : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(leerSesion);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  // Si el backend responde 401 (token caducado o inválido), cerramos sesión
  useEffect(() => {
    setAlCaducarSesion(logout);
    return () => setAlCaducarSesion(null);
  }, [logout]);

  async function login(email, password) {
    const data = await api(RUTA_LOGIN, {
      method: "POST",
      body: { email, password },
      auth: false,
    });

    // data = { message, token, user: { id, username, email, role } }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  // El backend crea siempre el usuario con rol "Inquilino" y NO devuelve token,
  // por eso el que llama debe hacer login después.
  async function register(username, email, password) {
    return api(RUTA_REGISTER, {
      method: "POST",
      body: { username, email, password },
      auth: false,
    });
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}