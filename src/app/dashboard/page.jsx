"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function DashboardPage() {
  // Control
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  // Doctor
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  //   Appointments
  const [myAppointments, setMyAppointments] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  //   Booking an appointment
  const [booking, setBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("");

  // Get appointments from the current patient logged
  const fetchMyAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Appointments/MyAppointments");
      setMyAppointments(response.data);
    } catch (error) {
      console.error("Error cargando turnos", error);
    } finally {
      setLoading(false);
    }
  };

  // Verify token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Get the list of doctors
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/Doctors");
        setDoctors(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem(token);
          router.push("/login");
        } else {
          setError("No se pudo cargar el directorio médico.");
        }
      }
    };

    // Get doctors and appointments simultaneosly
    Promise.all([fetchDoctors(), fetchMyAppointments()]).finally(() => {
      setLoading(false);
    });
  }, [router]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Set statuses when opening booking modal
  const openingBookingModal = (doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentDate("");
    setAvailableSlots([]);
    setSelectedTime("");
    setModalOpen(true);
  };

  // Date changing in booking modal
  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setAppointmentDate(newDate);

    if (!newDate || !selectedDoctor) return;

    setLoadingSlots(true);
    setBookingStatus("");

    // Get available slots from the selected doctor and date
    try {
      const response = await api.get(
        `/Appointments/AvailableSlots?doctorId=${selectedDoctor.id}&date=${newDate}`,
      );
      setAvailableSlots(response.data);

      if (response.data.length === 0) {
        setBookingStatus(
          "El doctor no atiende en este día o no hay turnos libres.",
        );
      }
    } catch (error) {
      setBookingStatus("Error al buscar los horarios disponibles.");
    } finally {
      setLoadingSlots(false);
    }
  };

  // Create an appointment in the booking modal
  const handleCreateAppointment = async (e) => {
    e.prevent.default();

    if (!selectedDoctor || !appointmentDate || !selectedTime) return;

    setBooking(true);
    setBookingStatus("");

    // Send data to create an appointment
    try {
      await api.post("/Appointments", {
        doctorId: selectedDoctor.id,
        appointmentDate: formattedDate,
      });

      setBookingStatus("¡Turno agendado con éxito!");

      // Get appointments from user
      fetchMyAppointments();

      // Close the booking modal
      setTimeout(() => {
        setModalOpen(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      setBookingStatus("Error al agendar el turno.");
    } finally {
      setBooking(false);
    }
  };

  // Cancel an appointment in booking modal
  const handleCancelAppointment = async (appointmentId) => {
    // Confirm cancellation
    const isConfirmed = window.confirm(
      "¿Estás seguro de que deseas cancelar este turno? Esta acción liberará el horario.",
    );
    if (!isConfirmed) return;

    // Delete appointment
    try {
      await api.delete(`/Appointments/${appointmentId}/Cancel`);

      // Reload appointments from user
      fetchMyAppointments();
    } catch (error) {}
    alert("Error al cancelar el turno");
  };

  // Format date for API
  const DateFormat = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("es-AR", {
      timeZone: "UTC",
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check loading status
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-900 font-medium">
        Cargando...
      </div>
    );

  return <div></div>;
}
