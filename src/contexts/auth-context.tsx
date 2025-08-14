import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User } from "../types";
import { authService } from "../lib/services/auth.service";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Storage keys
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper function to get stored token
  const getStoredToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  };

  // Helper function to get stored user
  const getStoredUser = (): User | null => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  };

  // Helper function to store user data
  const storeUserData = (userData: User, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Helper function to clear stored data
  const clearStoredData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Fetch current user with token
  const fetchCurrentUser = useCallback(
    async (token: string): Promise<User | null> => {
      try {
        const response = await authService.getCurrentUser();

        if (response.data?.user) {
          return response.data.user;
        }
        return null;
      } catch (error) {
        console.error("Error fetching user:", error);
        clearStoredData();
        return null;
      }
    },
    []
  );

  // Refresh user data
  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    const userData = await fetchCurrentUser(token);
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [fetchCurrentUser]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getStoredToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        // Try to validate stored user with server
        const userData = await fetchCurrentUser(token);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Stored data is invalid, clear it
          clearStoredData();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [fetchCurrentUser]);

  // Auto-refresh user data every 5 minutes
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      refreshUser();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });

      if (response.data) {
        const { user: userData, token } = response.data;
        // Store user data and token
        storeUserData(userData, token);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const token = getStoredToken();

    if (token) {
      try {
        // Call logout endpoint
        await authService.logout();
      } catch (error) {
        console.error("Logout error:", error);
        // Continue with logout even if server call fails
      }
    }

    // Clear local data
    clearStoredData();
  };

  // Create a value object to prevent unnecessary re-renders
  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
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
