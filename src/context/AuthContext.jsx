import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

function parsearToken(token) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return {
      username: decoded.sub,
      rol: decoded.rol || 'SOLICITANTE',
      areaId: decoded.areaId || null,
    };
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));
  const [usuario, setUsuario] = useState(
    () => parsearToken(localStorage.getItem('jwtToken'))
  );
  const [verificando, setVerificando] = useState(true);

  // Al recargar la página (F5), verifica que el token sigue válido
  // consultando GET /api/usuarios/me al backend
  useEffect(() => {
    const verificarSesion = async () => {
      const tokenGuardado = localStorage.getItem('jwtToken');

      if (!tokenGuardado) {
        setVerificando(false);
        return;
      }

      try {
        // Si el token es válido el backend responde 200
        await api.get('/api/usuarios/me');
        setToken(tokenGuardado);
        setUsuario(parsearToken(tokenGuardado));
      } catch (error) {
        // Si responde 401/403 el token venció — limpiamos todo
        console.warn('Sesión expirada, cerrando sesión automáticamente.');
        localStorage.removeItem('jwtToken');
        setToken(null);
        setUsuario(null);
      } finally {
        setVerificando(false);
      }
    };

    verificarSesion();
  }, []);

  const login = (jwtToken) => {
    localStorage.setItem('jwtToken', jwtToken);
    setToken(jwtToken);
    setUsuario(parsearToken(jwtToken));
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);
    setUsuario(null);
  };

  // Mientras verifica la sesión muestra una pantalla de carga
  // para evitar un parpadeo al /login innecesario
  if (verificando) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      token,
      usuario,
      login,
      logout,
      isAuthenticated: !!token,
      isAdmin: usuario?.rol === 'ADMIN',
      isAprobador: usuario?.rol === 'APROBADOR' || usuario?.rol === 'ADMIN',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}