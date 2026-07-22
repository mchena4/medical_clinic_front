"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState({
    type: "text",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loadUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ type: "text", message: "" });

    // Api call to authenticate user
    try {
      const response = await api.post("Auth/login", { email, password });

      const token = response.data.token;
      localStorage.setItem("token", token);

      // Get user
      const freshUser = await loadUser();

      if (!freshUser) {
        setStatusMessage({
          type: "error",
          message: "Error al cargar la información del usuario.",
        });
        return;
      }

      const userRole = freshUser.role;

      // Redirect based on user role
      switch (userRole) {
        case "Admin":
          router.push("/admin");
          break;

        case "Doctor":
        case "Patient":
        case "Receptionist":
          router.push("/dashboard");
          break;

        default:
          // Error message
          setStatusMessage({
            type: "error",
            message: "Rol de usuario desconocido. Contacta al soporte.",
          });
          return;
      }

      // Success message
      setStatusMessage({
        type: "success",
        message: "Inicio de sesión exitoso. Redirigiendo...",
      });
    } catch (error) {
      // Unauthorized
      if (error.response && error.response.status === 401) {
        setStatusMessage({
          type: "error",
          message: "Credenciales incorrectas. Por favor, inténtalo de nuevo.",
        });
      } else {
        // Handle another error message
        setStatusMessage({
          type: "error",
          message: "Error al iniciar sesión. Por favor, inténtalo de nuevo.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white placeholder:text-gray-400";

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-md sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-blue-500">Iniciar Sesión</h1>
          <p className="text-gray-600">Ingresa a tu cuenta</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="email"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="correo@ejemplo.com"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="**********"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {statusMessage.message && (
            <div
              className={`mb-4 p-3 rounded text-sm font-medium ${
                statusMessage.type === "error"
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {statusMessage.message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/register"
              className="text-blue-500 font-semibold hover:text-blue-600 hover:underline transition-colors"
            >
              Regístrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
