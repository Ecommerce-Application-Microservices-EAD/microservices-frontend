"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { decode } from "jsonwebtoken";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: any;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  getRole: () => string | null;
  flowState: string ;
  updateFlowState: (state: string) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [flowState, setFlowState] = useState<string>("");

  useEffect(() => {
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;

    if (storedToken) {
      const decodedToken = decode(storedToken);

      if (
        decodedToken &&
        typeof decodedToken === "object" &&
        "exp" in decodedToken &&
        typeof decodedToken.exp === "number" &&
        !isTokenExpired(decodedToken.exp)
      ) {
        setToken(storedToken);
        setUser(decodedToken);
      } else {
        console.warn("Token expired or invalid");
        localStorage.removeItem("jwtToken");
      }
    }

    setLoading(false);
  }, []);

  const isTokenExpired = (exp: number): boolean => {
    return Date.now() >= exp * 1000;
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:9000/api/user/login",
        { username, password }
      );
      const receivedToken = response.data; // Ensure the API returns the token string

      if (receivedToken) {
        setToken(receivedToken);
        const decodedToken: any = decode(receivedToken);
        setUser(decodedToken);
        localStorage.setItem("jwtToken", receivedToken); // Store the token

        // Redirect based on user role
        if (decodedToken?.role === "ADMIN") {
          router.push("/admin");
        } else if (decodedToken?.role === "USER") {
          router.push("/");
        }
      }
    } catch (error: any) {

      if (axios.isAxiosError(error))  {

        throw new Error(error.response?.data || "Login failed");
        
      } else {

        throw new Error("Some other error")
        
      }
      
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("jwtToken"); // Remove token from localStorage
    router.push("/"); // Redirect to home page
  };

  const getRole = (): string | null => {
    if (!user) return null;
    return user.role || null;
  };

  const isAuthenticated = !!token;

  const updateFlowState = (state: string): void => {
    setFlowState(state);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, getRole, loading, updateFlowState, flowState }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
