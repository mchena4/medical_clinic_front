import { useState } from "react";
import { api } from "../lib/api";

export default function AdminForms({
  activeTab,
  specialties,
  doctors,
  refreshData,
}) {
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [doctorForm, setDoctorForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    licenseNumber: "",
    phoneNumber: "",
    specialtyId: "",
  });
  const [receptionistForm, setReceptionistForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [specialtyForm, setSpecialtyForm] = useState({ name: "" });
  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
    role: "Admin",
  });
  const [scheduleForm, setScheduleForm] = useState({
    doctorId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    slotDurationMinutes: "",
  });

  // Helper function to show status messages
  const showMessage = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: "", text: "" }), 4000);
  };

  // Function to handle doctor registration
  const handleRegisterDoctor = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Call to backend API to register doctor with the form data
    try {
      await api.post("/Admin/RegisterDoctor", {
        ...doctorForm,
        specialtyId: Number(doctorForm.specialtyId),
      });
      console.log(doctorForm);
      showMessage("success", "Médico registrado exitosamente.");
      // Reset doctor form and update doctor list
      setDoctorForm({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        licenseNumber: "",
        phoneNumber: "",
        specialtyId: "",
      });
      refreshData();
    } catch (err) {
      showMessage(
        "error",
        err.response?.data?.message ||
          err.response?.data ||
          "Error al registrar médico.",
      );
      console.log("Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle doctor schedule registration
  const handleRegisterDoctorSchedule = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Convert form data to the expected payload format
      const payload = {
        doctorId: Number(scheduleForm.doctorId),
        dayOfWeek: Number(scheduleForm.dayOfWeek),
        startTime: `${scheduleForm.startTime}:00`,
        endTime: `${scheduleForm.endTime}:00`,
        slotDurationMinutes: Number(scheduleForm.slotDurationMinutes),
      };

      // Make API call to register the schedule
      await api.post("/Schedules", payload);
      // Show success message and reset schedule form
      showMessage("success", "Horario de atención registrado exitosamente.");
      setScheduleForm({
        doctorId: "",
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        slotDurationMinutes: "",
      });
    } catch (err) {
      showMessage(
        "error",
        err.response?.data?.message ||
          err.response?.data ||
          "Error al crear los horarios.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle receptionist registration
  const handleRegisterReceptionist = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Call to backend API to register receptionist with the form data
      await api.post("/Admin/RegisterReceptionist", receptionistForm);
      showMessage("success", "Recepcionista registrada exitosamente.");
      // Reset receptionist form and update receptionist list
      setReceptionistForm({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
      });
    } catch (err) {
      showMessage(
        "error",
        err.response?.data?.message ||
          err.response?.data ||
          "Error al registrar recepcionista.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSpecialty = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Call to backend API to create specialty with the form data
      await api.post("/Admin/CreateSpecialty", specialtyForm);
      showMessage("success", "Especialidad creada exitosamente.");
      // Reset specialty form and update specialty list
      setSpecialtyForm({ name: "" });
      refreshData();
    } catch (err) {
      showMessage(
        "error",
        err.response?.data?.message ||
          err.response?.data ||
          "Error al crear especialidad.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle user creation
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Call to backend API to create user with the form data
      await api.post("/Admin/CreateUser", userForm);
      showMessage("success", `Usuario (${userForm.role}) creado exitosamente.`);
      // Reset user form and update user list
      setUserForm({ email: "", password: "", role: "Admin" });
    } catch (err) {
      showMessage(
        "error",
        err.response?.data?.message ||
          err.response?.data ||
          "Error al crear usuario.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-gray-900 bg-white placeholder:text-gray-700";

  return (
    <>
      {statusMsg.text && (
        <div
          className={`mb-6 p-4 rounded-lg border font-medium ${
            statusMsg.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Med Form */}
      {activeTab === "doctor" && (
        <form onSubmit={handleRegisterDoctor} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Registrar Nuevo Médico
          </h2>
          {/* First name input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Nombre
              </label>
              <input
                type="text"
                required
                value={doctorForm.firstName}
                onChange={(e) =>
                  setDoctorForm({ ...doctorForm, firstName: e.target.value })
                }
                className={inputClass}
              />
            </div>
            {/* Last name input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Apellido
              </label>
              <input
                type="text"
                required
                value={doctorForm.lastName}
                onChange={(e) =>
                  setDoctorForm({ ...doctorForm, lastName: e.target.value })
                }
                className={inputClass}
              />
            </div>
            {/* License number input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Matrícula
              </label>
              <input
                type="text"
                required
                value={doctorForm.licenseNumber}
                onChange={(e) =>
                  setDoctorForm({
                    ...doctorForm,
                    licenseNumber: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            {/* Select Specialty input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Especialidad
              </label>
              <select
                required
                value={doctorForm.specialtyId}
                onChange={(e) =>
                  setDoctorForm({ ...doctorForm, specialtyId: e.target.value })
                }
                className={inputClass}
              >
                <option value="" disabled>
                  Seleccionar...
                </option>
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Phone number input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                required
                value={doctorForm.phoneNumber}
                onChange={(e) =>
                  setDoctorForm({ ...doctorForm, phoneNumber: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>
          <hr className="my-6 border-gray-100" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={doctorForm.email}
                onChange={(e) =>
                  setDoctorForm({ ...doctorForm, email: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña temporal
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={doctorForm.password}
                onChange={(e) =>
                  setDoctorForm({ ...doctorForm, password: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {isSubmitting ? "Registrando..." : "Crear Perfil Médico"}
          </button>
        </form>
      )}

      {/* Schedule Form */}
      {activeTab === "schedule" && (
        <form onSubmit={handleRegisterDoctorSchedule} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Asignar Horario de Atención
          </h2>
          {/* Select Doctor Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Médico
              </label>
              <select
                required
                value={scheduleForm.doctorId}
                onChange={(e) =>
                  setScheduleForm({ ...scheduleForm, doctorId: e.target.value })
                }
                className={inputClass}
              >
                <option value="" disabled>
                  Seleccionar médico...
                </option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Select Day of the Week Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Día de la Semana
              </label>
              <select
                required
                value={scheduleForm.dayOfWeek}
                onChange={(e) =>
                  setScheduleForm({
                    ...scheduleForm,
                    dayOfWeek: e.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="" disabled>
                  Seleccionar día...
                </option>
                <option value="1">Lunes</option>
                <option value="2">Martes</option>
                <option value="3">Miércoles</option>
                <option value="4">Jueves</option>
                <option value="5">Viernes</option>
                <option value="6">Sábado</option>
                <option value="0">Domingo</option>
              </select>
            </div>
            {/* Start Time Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Hora de Inicio
              </label>
              <input
                type="time"
                required
                value={scheduleForm.startTime}
                onChange={(e) =>
                  setScheduleForm({
                    ...scheduleForm,
                    startTime: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            {/* End Time Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Hora de Fin
              </label>
              <input
                type="time"
                required
                value={scheduleForm.endTime}
                onChange={(e) =>
                  setScheduleForm({ ...scheduleForm, endTime: e.target.value })
                }
                className={inputClass}
              />
            </div>
            {/* Slot Duration Input */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Duración del Turno (minutos)
              </label>
              <input
                type="number"
                required
                min="5"
                step="5"
                placeholder="Ej: 30"
                value={scheduleForm.slotDurationMinutes}
                onChange={(e) =>
                  setScheduleForm({
                    ...scheduleForm,
                    slotDurationMinutes: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {isSubmitting ? "Guardando..." : "Guardar Horario"}
          </button>
        </form>
      )}

      {/* Receptionist Form */}
      {activeTab === "receptionist" && (
        <form onSubmit={handleRegisterReceptionist} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Registrar Recepcionista
          </h2>
          {/* First Name Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                required
                value={receptionistForm.firstName}
                onChange={(e) =>
                  setReceptionistForm({
                    ...receptionistForm,
                    firstName: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            {/* Last Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                required
                value={receptionistForm.lastName}
                onChange={(e) =>
                  setReceptionistForm({
                    ...receptionistForm,
                    lastName: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            {/* Phone Number Input */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                required
                value={receptionistForm.phoneNumber}
                onChange={(e) =>
                  setReceptionistForm({
                    ...receptionistForm,
                    phoneNumber: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            {/* Email Input */}
          </div>
          <hr className="my-6 border-gray-100" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={receptionistForm.email}
                onChange={(e) =>
                  setReceptionistForm({
                    ...receptionistForm,
                    email: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña temporal
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={receptionistForm.password}
                onChange={(e) =>
                  setReceptionistForm({
                    ...receptionistForm,
                    password: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {isSubmitting ? "Registrando..." : "Crear Perfil Recepcionista"}
          </button>
        </form>
      )}

      {/* Specialty Form */}
      {activeTab === "specialty" && (
        <form onSubmit={handleCreateSpecialty} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Añadir Especialidad Médica
          </h2>
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Especialidad
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Cardiología, Pediatría..."
              value={specialtyForm.name}
              onChange={(e) => setSpecialtyForm({ name: e.target.value })}
              className={inputClass}
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {isSubmitting ? "Guardando..." : "Crear Especialidad"}
          </button>

          {/* All Specialties */}
          <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Especialidades Actuales ({specialties.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {specialties.map((spec) => (
                <span
                  key={spec.id}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200"
                >
                  {spec.name}
                </span>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* User Form */}
      {activeTab === "user" && (
        <form onSubmit={handleCreateUser} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Crear Usuario Administrador
          </h2>
          {/* Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
                className={inputClass}
              />
            </div>
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña temporal
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={userForm.password}
                onChange={(e) =>
                  setUserForm({ ...userForm, password: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>
          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {isSubmitting ? "Guardando..." : "Crear Usuario"}
          </button>
        </form>
      )}
    </>
  );
}
