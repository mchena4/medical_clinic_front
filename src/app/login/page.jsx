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

    try {
      const response = await api.post("Auth/login", { email, password });

      const token = response.data.token;
      localStorage.setItem("token", token);

      const userResponse = await api.get("/Auth/me");
      const userRole = userResponse.data.role;

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
}
