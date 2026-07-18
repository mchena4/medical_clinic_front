"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

// Create context
const AuthContext = createContext();

// Create provider
export function AuthProvider({ children }) {
  // User info and loading state
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const router = useRouter();

  // Function that get the user info
  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoadingAuth(false);
      return;
    }

    try {
      // Call API for user info
      const response = await api.get("/Auth/me");
      setUser(response.data);
    } catch (error) {
      console.log("Token inválido o expirado");
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Fetch user info
  useEffect(() => {
    loadUser();
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoadingAuth, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
