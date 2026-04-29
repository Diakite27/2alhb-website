"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "./api";
import type { MemberProfile } from "./api";

interface AuthContextType {
  user: MemberProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  refreshProfile: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MemberProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("2alhb-access");
    localStorage.removeItem("2alhb-refresh");
  }, []);

  const refreshProfile = useCallback(async () => {
    const accessToken = token || localStorage.getItem("2alhb-access");
    if (!accessToken) return;
    try {
      const profile = await authApi.getProfile(accessToken);
      setUser(profile);
    } catch {
      // Token expired — try refresh
      const refreshToken = localStorage.getItem("2alhb-refresh");
      if (refreshToken) {
        try {
          const { access } = await authApi.refreshToken(refreshToken);
          localStorage.setItem("2alhb-access", access);
          setToken(access);
          const profile = await authApi.getProfile(access);
          setUser(profile);
        } catch {
          logout();
        }
      } else {
        logout();
      }
    }
  }, [token, logout]);

  /* eslint-disable react-hooks/set-state-in-effect -- intentional: syncing auth state from localStorage on mount */
  useEffect(() => {
    const savedToken = localStorage.getItem("2alhb-access");
    if (savedToken) {
      setToken(savedToken);
      authApi
        .getProfile(savedToken)
        .then((profile) => {
          setUser(profile);
          setIsLoading(false);
        })
        .catch(async () => {
          const refreshToken = localStorage.getItem("2alhb-refresh");
          if (refreshToken) {
            try {
              const { access } = await authApi.refreshToken(refreshToken);
              localStorage.setItem("2alhb-access", access);
              setToken(access);
              const profile = await authApi.getProfile(access);
              setUser(profile);
            } catch {
              logout();
            }
          } else {
            logout();
          }
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const login = async (username: string, password: string) => {
    const tokens = await authApi.login(username, password);
    localStorage.setItem("2alhb-access", tokens.access);
    localStorage.setItem("2alhb-refresh", tokens.refresh);
    setToken(tokens.access);
    const profile = await authApi.getProfile(tokens.access);
    setUser(profile);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
