import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));

  const login = (jwtToken) => {
    localStorage.setItem('jwtToken', jwtToken);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}