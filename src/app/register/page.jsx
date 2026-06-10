"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [statusMessage, setStatusMessage] = useState({
    type: "text",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ type: "text", message: "" });

    try {
      const response = await api.post("/auth/register", formData);
      setStatusMessage({
        type: "success",
        message:
          "Usuario registrado exitosamente. Redigirigendo al inicio de sesion...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: "Error al registrar el usuario.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
}
