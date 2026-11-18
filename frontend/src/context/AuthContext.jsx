import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function leerUsuarioGuardado() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(leerUsuarioGuardado);

  async function login(email, password) {
    // sustituir por la llamada real al backend
    await new Promise((resolve) => setTimeout(resolve, 800));
    const usuario = {
      nombre: email.split("@")[0],
      email,
      rol: email.startsWith("agente") ? "agente" : "cliente",
    };

    localStorage.setItem("user", JSON.stringify(usuario));
    setUser(usuario);
    return usuario;
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}