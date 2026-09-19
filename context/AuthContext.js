"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("kt_customer_token");
      const storedUser = localStorage.getItem("kt_customer_user");
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse stored customer auth", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.auth.login(email, password);
    if (res?.accessToken) {
      localStorage.setItem("kt_customer_token", res.accessToken);
      localStorage.setItem("kt_customer_user", JSON.stringify(res.user));
      if (res.session) {
        localStorage.setItem("kt_customer_session", JSON.stringify(res.session));
      }
      setToken(res.accessToken);
      setUser(res.user);
      return res;
    }
    throw new Error("Invalid login response from server");
  };

  const register = async (data) => {
    const res = await api.auth.register(data);
    if (res?.accessToken) {
      localStorage.setItem("kt_customer_token", res.accessToken);
      localStorage.setItem("kt_customer_user", JSON.stringify(res.user));
      if (res.session) {
        localStorage.setItem("kt_customer_session", JSON.stringify(res.session));
      }
      setToken(res.accessToken);
      setUser(res.user);
      return res;
    }
    throw new Error("Registration succeeded but session could not be established.");
  };

  const logout = async () => {
    try {
      await api.auth.logout().catch(() => {});
    } finally {
      localStorage.removeItem("kt_customer_token");
      localStorage.removeItem("kt_customer_user");
      localStorage.removeItem("kt_customer_session");
      setToken(null);
      setUser(null);
      window.location.href = "/signin";
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await api.auth.getProfile();
      if (res?.user) {
        setUser(res.user);
        localStorage.setItem("kt_customer_user", JSON.stringify(res.user));
      }
    } catch (e) {
      console.warn("Failed to refresh profile:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
