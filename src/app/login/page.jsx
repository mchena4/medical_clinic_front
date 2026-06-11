"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState({
    type: "text",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ type: "text", message: "" });

    // Api call to authenticate user
    try {
      const response = await api.post("Auth/login", { email, password });

      const token = response.data.token;
      localStorage.setItem("token", token);

      const userResponse = await api.get("/Auth/me");
      const userRole = userResponse.data.role;

      // Redirect based on user role
      switch (userRole) {
        case "Admin":
          router.push("/admin");
          break;

        case "Doctor":
          router.push("/doctor");
          break;

        case "Patient":
          router.push("/dashboard");
          break;

        case "Receptionist":
          router.push("/receptionist");
          break;

        default:
          setError("Rol de usuario desconocido. Contacta al soporte.");
      }

      setStatusMessage({
        type: "success",
        message: "Inicio de sesión exitoso. Redirigiendo...",
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setStatusMessage({
          type: "error",
          message: "Credenciales incorrectas. Por favor, inténtalo de nuevo.",
        });
      } else {
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>

          {/* Register Link */}
          <button className="w-full mt-4 text-center text-sm text-gray-600 hover:text-gray-800">
            <Link href="/register">¿No tienes una cuenta? Regístrate</Link>
          </button>
        </form>
      </div>
    </div>
  );
}
