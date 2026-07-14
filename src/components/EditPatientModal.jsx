import { useState } from "react";
import { api } from "../lib/api";

export default function EditPatientModal({
  isOpen,
  onClose,
  patientData,
  onUpdateSuccess,
}) {
  // Patient data form
  const [formData, setFormData] = useState({
    firstName: patientData.firstName || "",
    lastName: patientData.lastName || "",
    dni: patientData.dni || "",
    phoneNumber: patientData.phoneNumber || "",
    dateOfBirth: patientData.dateOfBirth
      ? patientData.dateOfBirth.split("T")[0]
      : "",
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Render nothing if the modal is not open
  if (!isOpen) return null;

  //   Change handler for form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //   Submit handler for updating patient data
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await api.put(`/Patients/UpdatePatient/${patientData.id}`, formData);
      onUpdateSuccess();
    } catch (error) {
      console.error("Error al actualizar los datos del paciente:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Modal title */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">
            Editar Datos Personales
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdateSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            {/* First name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-700">
                Nombre
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="p-2 border border-slate-200 rounded outline-none focus:border-sky-500 text-slate-700"
              />
            </div>
            {/* Last name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-700">
                Apellido
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="p-2 border border-slate-200 rounded outline-none focus:border-sky-500 text-slate-700"
              />
            </div>
          </div>
          {/* DNI */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">DNI</label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              required
              className="p-2 border border-slate-200 rounded outline-none focus:border-sky-500 text-slate-700"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">
              Teléfono
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className="p-2 border border-slate-200 rounded outline-none focus:border-sky-500 text-slate-700"
            />
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
              className="p-2 border border-slate-200 rounded outline-none focus:border-sky-500 text-slate-700"
            />
          </div>

          {/* Close button */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded cursor-pointer"
            >
              Cancelar
            </button>
            {/* Save Changes Button */}
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 bg-sky-600 text-white font-medium rounded hover:bg-sky-700 disabled:opacity-50 cursor-pointer"
            >
              {isUpdating ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
