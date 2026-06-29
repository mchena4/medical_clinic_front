"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useState } from "react";
import AdminForms from "@/components/AdminForms";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState("doctor");
  const router = useRouter();

  // Function to fetch specialties and doctors
  const fetchData = async () => {
    try {
      const [specialtyData, doctorData] = await Promise.all([
        api.get("/Admin/Specialties"),
        api.get("/Doctors"),
      ]);
      setSpecialties(specialtyData.data);
      setDoctors(doctorData.data);
    } catch (err) {
      console.error("Error al cargar datos iniciales", err);
    }
  };

  // Refresh data when component mounts
  useEffect(() => {
    fetchData().then(() => setLoading(false));
  }, []);
  //   Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
  }, [router]);

  // Function to logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Render loading state
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-medium">
        Cargando panel de administración...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-slate-900 shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-white font-bold">
            ⚙️
          </div>
          <h1 className="text-xl font-bold text-white">
            Panel de Administración
          </h1>
        </div>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-sm text-slate-300 hover:text-white font-medium transition-colors"
        >
          Cerrar Sesión
        </button>
      </nav>

      <main className="p-8 max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
          {[
            // Tabs
            { id: "doctor", label: "Alta Médico" },
            { id: "receptionist", label: "Alta Recepcionista" },
            { id: "specialty", label: "Agregar Especialidad" },
            { id: "user", label: "Agregar Usuario" },
            { id: "schedule", label: "Agregar Horarios Médicos" },
          ].map((tab) => (
            // Tab Button
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Forms */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <AdminForms
            activeTab={activeTab}
            specialties={specialties}
            doctors={doctors}
            refreshData={fetchData}
          />
        </div>
      </main>
    </div>
  );
}
