"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();

  // Register data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  // Messages and loading state
  const [statusMessage, setStatusMessage] = useState({
    type: "text",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ type: "text", message: "" });

    try {
      // Call the API to register the user
      const response = await api.post("/auth/register", formData);
      setStatusMessage({
        type: "success",
        message:
          "Usuario registrado exitosamente. Redigirigendo al inicio de sesion...",
      });

      // Redirect to login after a short delay
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-800">
      <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Crear Cuenta</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Ingresa tus datos personales para registrarte como paciente.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {/* Full name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Nombre
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Juan"
                className="px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all bg-slate-50 focus:bg-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Apellido
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Pérez"
                className="px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* DNI and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                DNI / Documento
              </label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
                placeholder="Sin puntos ni espacios"
                className="px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all bg-slate-50 focus:bg-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Teléfono
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="Ej: 1123456789"
                className="px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Date of birth */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all bg-slate-50 focus:bg-white text-slate-700 w-full"
            />
          </div>

          <hr className="border-slate-100 my-2" />

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="juanperez@ejemplo.com"
              className="px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all bg-slate-50 focus:bg-white"
            />
          </div>
          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Mínimo 8 caracteres"
              className="px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Status Messages (Success or Error) */}
          {statusMessage.message && (
            <div
              className={`p-4 rounded-lg text-sm font-medium ${
                statusMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {statusMessage.message}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 mt-2 text-white font-semibold rounded-lg shadow-sm transition-all
              ${
                isSubmitting
                  ? "bg-sky-400 cursor-not-allowed"
                  : "bg-sky-600 hover:bg-sky-700 hover:shadow"
              }`}
          >
            {isSubmitting ? "Registrando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center text-sm text-slate-500">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="text-sky-600 font-semibold hover:text-sky-700 transition-colors"
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
