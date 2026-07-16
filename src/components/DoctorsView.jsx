"use client";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import BookingModal from "./BookingModal";

export default function DoctorsView() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  // Booking states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("");

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/Doctors");
        setDoctors(response.data);
      } catch (error) {
        setError("No se pudo cargar el directorio médico.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Open booking modal for a selected doctor and reset booking states
  const openingBookingModal = (doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentDate("");
    setAvailableSlots([]);
    setSelectedTime("");
    setModalOpen(true);
  };

  // Function to check available slots for a selected date and doctor
  const handleDateChange = async (e) => {
    // Set the selected date and reset booking states
    const newDate = e.target.value;
    setAppointmentDate(newDate);
    if (!newDate || !selectedDoctor) return;

    setLoadingSlots(true);
    setBookingStatus("");

    // Call the API to get available slots from doctor and date
    try {
      const response = await api.get(
        `/Appointments/AvailableSlots?doctorId=${selectedDoctor.id}&date=${newDate}`,
      );
      setAvailableSlots(response.data);
      // If no slots are available
      if (response.data.length === 0)
        setBookingStatus(
          "El doctor no atiende en este día o no hay turnos libres.",
        );
    } catch (error) {
      setBookingStatus("Error al buscar los horarios disponibles.");
    } finally {
      setLoadingSlots(false);
    }
  };

  // Function to create an appointment
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    // Check if all required fields are filled
    if (!selectedDoctor || !appointmentDate || !selectedTime) return;

    setBooking(true);
    setBookingStatus("");

    // Combine date and time into a single ISO string
    const combinedDateTime = `${appointmentDate}T${selectedTime}:00`;

    try {
      // Call the API to create the appointment
      await api.post("/Appointments", {
        doctorId: selectedDoctor.id,
        appointmentDate: combinedDateTime,
      });
      setBookingStatus("¡Turno agendado con éxito!");
      setTimeout(() => setModalOpen(false), 2000);
    } catch (error) {
      setBookingStatus("Error al agendar el turno.");
    } finally {
      setBooking(false);
    }
  };

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(
    (d) =>
      d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialty?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Loading and error states
  if (loading) return <div>Cargando directorio...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Directorio Médico
      </h2>

      {/* Input Search */}
      <input
        type="text"
        placeholder="Buscar por nombre o especialidad..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6 p-2 border rounded text-slate-800"
      />

      {/* Doctors list */}
      <div className="grid gap-4">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <span className="text-slate-700">
              {doctor.name} - {doctor.specialty}
            </span>
            <button
              onClick={() => openingBookingModal(doctor)}
              className="bg-sky-600 text-white px-4 py-2 rounded"
            >
              Agendar Turno
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal opening */}
      {modalOpen && (
        <BookingModal
          doctor={selectedDoctor}
          appointmentDate={appointmentDate}
          availableSlots={availableSlots}
          selectedTime={selectedTime}
          loadingSlots={loadingSlots}
          booking={booking}
          bookingStatus={bookingStatus}
          onClose={() => setModalOpen(false)}
          onDateChange={handleDateChange}
          onSelectTime={setSelectedTime}
          onSubmit={handleCreateAppointment}
        />
      )}
    </div>
  );
}
