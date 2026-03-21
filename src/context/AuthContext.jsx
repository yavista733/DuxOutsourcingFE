import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

// Función helper que decodifica el token y extrae los datos del usuario
function parsearToken(token) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return {
      username: decoded.sub,
      rol: decoded.rol || 'SOLICITANTE', // valor por defecto si no viene
      areaId: decoded.areaId || null,
    };
  } catch (error) {
    return null; // token inválido o mal formado
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));
  const [usuario, setUsuario] = useState(
    () => parsearToken(localStorage.getItem('jwtToken'))
  );

  const login = (jwtToken) => {
    localStorage.setItem('jwtToken', jwtToken);
    setToken(jwtToken);
    setUsuario(parsearToken(jwtToken)); // extrae rol y areaId automáticamente
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{
      token,
      usuario,       // { username, rol, areaId }
      login,
      logout,
      isAuthenticated: !!token,
      // Helpers de rol para usar fácilmente en cualquier componente
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