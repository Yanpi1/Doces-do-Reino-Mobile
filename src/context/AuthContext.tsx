import React, { createContext, useContext, useState } from 'react';
import * as api from '../services/api';

interface AuthContextValue {
  isLoggedIn: boolean;
  loading: boolean;
  error: string;
  doLogin: (user: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const doLogin = async (user: string, pass: string): Promise<boolean> => {
    setLoading(true);
    setError('');
    try {
      const res = await api.login(user.trim(), pass);
      if (res && res.ok) {
        setIsLoggedIn(true);
        return true;
      }
      setError(res?.error || 'Usuário ou senha incorretos.');
      return false;
    } catch (e) {
      setError('Erro de conexão com o servidor.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, error, doLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
