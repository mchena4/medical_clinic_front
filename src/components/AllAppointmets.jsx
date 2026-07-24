"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AllAppointmentsView() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/Doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error al cargar los doctores", error);
    }
  };

  const fetchAllAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      // Call API to get the appointments according to the specified date
      const response = await api.get(`/Appointments?date=${filterDate}`);
      setAppointments(response.data);
    } catch (error) {
      // Error message
      console.error("Error cargando turnos:", error);
      setError("No se pudieron cargar los turnos de la clínica.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  //   Reload appointments when component is mount
  useEffect(() => {
    fetchAllAppointments();
  }, [filterDate]);

  //   Cancel appointment
  const handleCancelAppointment = async (appointmentId) => {
    // Confirm
    const isConfirmed = window.confirm(
      "¿Estás segura de que deseas cancelar este turno? Esta acción liberará el horario.",
    );
    if (!isConfirmed) return;

    try {
      // Call api for cancel appointment with id
      await api.delete(`/Appointments/${appointmentId}/Cancel`);
      //   Reload appointments
      fetchAllAppointments();
    } catch (error) {
      alert("Error al cancelar el turno");
    }
  };

  //   Fillter appointments by date or text
  const filteredAppointments = appointments.filter((appt) => {
    if (selectedDoctor === "") return true;

    return appt.doctor === selectedDoctor;
  });

  //   Format date to readable format
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("es-AR", {
      timeZone: "UTC",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Gestión de Turnos
      </h2>
      {/* Filter by date */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex flex-col gap-1 w-full md:w-1/3">
          <label className="text-sm font-semibold text-slate-700">Fecha</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 border border-slate-200 rounded-lg outline-none focus:border-sky-500 text-slate-800"
          />
        </div>

        {/* Filter by doctor */}
        <div className="flex flex-col gap-1 w-full md:w-2/3">
          <label className="text-sm font-semibold text-slate-700">
            Filtrar por Médico
          </label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="p-2 border border-slate-200 rounded-lg outline-none focus:border-sky-500 bg-white text-slate-800"
          >
            <option value="">Todos los médicos</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.name}>
                {doc.name} - {doc.specialty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error rendering */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex-1">
        {/* Loading rendering */}
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Cargando turnos...
          </div>
        ) : (
          // Headers
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm">
                <th className="py-3 px-4 font-semibold border-b border-slate-200">
                  Hora
                </th>
                <th className="py-3 px-4 font-semibold border-b border-slate-200">
                  Paciente
                </th>
                <th className="py-3 px-4 font-semibold border-b border-slate-200">
                  Médico
                </th>
                <th className="py-3 px-4 font-semibold border-b border-slate-200">
                  Estado
                </th>
                <th className="py-3 px-4 font-semibold border-b border-slate-200 text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    No hay turnos registrados para esta fecha.
                  </td>
                </tr>
              ) : (
                // Appointments data
                filteredAppointments.map((appt) => (
                  <tr
                    key={appt.appointmentId}
                    className="hover:bg-slate-50 border-b border-slate-100 last:border-0"
                  >
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {formatTime(appt.date)}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{appt.patient}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {appt.doctor || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      {/* Rendering based on status of appointments */}
                      {appt.status === "Pending" && (
                        <span className="bg-amber-100 text-amber-700 py-1 px-2 rounded text-xs font-bold uppercase">
                          Pendiente
                        </span>
                      )}
                      {appt.status === "Completed" && (
                        <span className="bg-emerald-100 text-emerald-700 py-1 px-2 rounded text-xs font-bold uppercase">
                          Completado
                        </span>
                      )}
                      {appt.status === "Cancelled" && (
                        <span className="bg-slate-100 text-slate-500 py-1 px-2 rounded text-xs font-bold uppercase">
                          Cancelado
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {appt.status === "Pending" && (
                        // Cancel button for pending appointments
                        <button
                          onClick={() =>
                            handleCancelAppointment(appt.appointmentId)
                          }
                          className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors cursor-pointer"
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
