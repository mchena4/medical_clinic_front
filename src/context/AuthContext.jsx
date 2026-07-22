"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "../lib/api";

// Create context
const AuthContext = createContext();

// Create provider
export function AuthProvider({ children }) {
  // User info and loading state
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Function that get the user info
  const loadUser = async () => {
    setIsLoadingAuth(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoadingAuth(false);
      return;
    }

    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Call API for user info
      const response = await api.get("/Auth/me");
      setUser(response.data);
      // Return user info
      return response.data;
    } catch (error) {
      // Remove token and return
      console.log("Error validando el token", error);
      localStorage.removeItem("token");
      setUser(null);
      return null;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Fetch user info when route changes
  useEffect(() => {
    loadUser();
  }, [pathname]);

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
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
