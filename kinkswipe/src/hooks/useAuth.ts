import { useState, useEffect } from 'react';
import { authManager, type AuthState } from '../auth/AuthManager';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    authManager.initialize().then(() => {
      setState(authManager.getAuthState());
    });
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    await authManager.login({ email, password });
    setState(authManager.getAuthState());
  };

  const register = async (email: string, password: string, name?: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    await authManager.register({ email, password, name });
    setState(authManager.getAuthState());
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    await authManager.logout();
    setState(authManager.getAuthState());
  };

  const sync = async () => {
    await authManager.syncUserData();
    setState(authManager.getAuthState());
  };

  return {
    ...state,
    login,
    register,
    logout,
    sync
  };
}
