"use client";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function MyAppointmentsView() {
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's appointments
  const fetchMyAppointments = async () => {
    setLoading(true);
    // Fetch appointments from the API
    try {
      const response = await api.get("/Appointments/MyAppointments");
      setMyAppointments(response.data);
    } catch (error) {
      console.error("Error cargando turnos", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments on component mount
  useEffect(() => {
    fetchMyAppointments();
  }, []);

  // Function to handle appointment cancellation
  const handleCancelAppointment = async (appointmentId) => {
    // Confirm
    const isConfirmed = window.confirm(
      "¿Estás seguro de que deseas cancelar este turno? Esta acción liberará el horario.",
    );
    if (!isConfirmed) return;

    try {
      // Call the API and reload appointments
      await api.delete(`/Appointments/${appointmentId}/Cancel`);
      fetchMyAppointments();
    } catch (error) {
      alert("Error al cancelar el turno");
    }
  };

  // Format date to a readable format
  const DateFormat = (isoString) => {
    const date = new Date(isoString);

    return date.toLocaleString("es-AR", {
      timeZone: "UTC",
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-8 h-8 rounded-full border-[3px] border-slate-200 animate-spin border-t-teal-700" />
        <p className="text-sm text-slate-500">Cargando tus turnos...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Mis Turnos</h2>
      {myAppointments.length === 0 ? (
        <p className="text-slate-500">No tienes turnos agendados.</p>
      ) : (
        // List of appointments
        <div className="grid gap-4">
          {myAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white p-4 rounded-lg shadow border border-slate-100 flex flex-col items-start"
            >
              <h3 className="text-lg text-slate-700 font-semibold">
                {appointment.doctorName}
              </h3>
              <p className="text-slate-600 mb-3">
                {DateFormat(appointment.date)}
              </p>

              {/* Appointment pending */}
              {appointment.status === "Pending" && (
                <button
                  onClick={() => handleCancelAppointment(appointment.id)}
                  className="bg-red-50 text-red-600 border border-red-200 py-1.5 px-4 rounded font-medium hover:bg-red-100 transition-colors"
                >
                  Cancelar Turno
                </button>
              )}

              {/* Appointment Completed */}
              {appointment.status === "Completed" && (
                <span className="bg-emerald-100 text-emerald-700 py-1 px-3 rounded-full text-sm font-semibold">
                  Turno Completado
                </span>
              )}

              {/* Appointment Cancelled */}
              {appointment.status === "Cancelled" && (
                <span className="bg-slate-100 text-slate-500 py-1 px-3 rounded-full text-sm font-semibold">
                  Turno Cancelado
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
