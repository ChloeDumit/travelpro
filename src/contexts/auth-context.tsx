import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "../types";
import { authService, AuthUser } from "../lib/services/auth.service";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const getStoredToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  };

  const getStoredUser = (): AuthUser | null => {
    const stored = localStorage.getItem(USER_KEY);
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const storeUserData = (userData: AuthUser, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setState(prev => ({
      ...prev,
      user: userData,
      isAuthenticated: true,
      error: null,
    }));
  };

  const clearStoredData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState(prev => ({
      ...prev,
      user: null,
      isAuthenticated: false,
      error: null,
    }));
  };

  const fetchCurrentUser = useCallback(async (token: string): Promise<AuthUser | null> => {
    try {
      const response = await authService.getCurrentUser();
      return response.data?.user || null;
    } catch (error) {
      console.error("Error fetching user:", error);
      clearStoredData();
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const userData = await fetchCurrentUser(token);
    if (userData) {
      setState(prev => ({
        ...prev,
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      }));
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.login({ email, password });
      
      if (response.data) {
        const { user: userData, token } = response.data;
        storeUserData(userData as AuthUser, token);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearStoredData();
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = getStoredToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        const userData = await fetchCurrentUser(token);
        if (userData) {
          setState(prev => ({
            ...prev,
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          }));
        } else {
          clearStoredData();
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, [fetchCurrentUser]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}