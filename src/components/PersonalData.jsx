import { useState, useEffect } from "react";
import { api } from "../lib/api";
import EditPatientModal from "../components/EditPatientModal";
import { useAuth } from "@/context/AuthContext";

export default function PersonalData() {
  const [personalData, setPersonalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Update patient data and close modal on success
  const handleUpdateSuccess = () => {
    setIsEditModalOpen(false);
    fetchPersonalData();
  };

  const fetchPersonalData = async () => {
    setLoading(true);
    try {
      // User ID
      const responseData = await api.get(`/Patients/GetPatient/${user.userId}`);
      setPersonalData(responseData.data);
    } catch (error) {
      console.error(error);
      setError("Error al cargar los datos personales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalData();
  }, []);

  // Loading rendering
  if (loading) {
    return <div className="text-slate-500">Cargando tus datos...</div>;
  }

  // Error rendering
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 max-w-2xl">
        <h2 className="text-2xl font-bold text-slate-800 m-0">
          Mis Datos Personales
        </h2>
        {/* Edit Personal Data Button */}
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2 bg-sky-100 text-sky-600 font-medium rounded-lg hover:bg-sky-50 transition-colors cursor-pointer"
        >
          Editar Datos
        </button>
      </div>

      {/* Personal Data */}
      {personalData && (
        <div className="bg-white p-6 rounded-lg shadow border border-slate-100 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <p className="text-sm text-slate-500">Nombre completo</p>
              <p className="font-medium text-slate-800">
                {personalData.firstName} {personalData.lastName}
              </p>
            </div>
            {/* DNI */}
            <div>
              <p className="text-sm text-slate-500">Documento / DNI</p>
              <p className="font-medium text-slate-800">{personalData.dni}</p>
            </div>
            {/* Phone Number */}
            <div>
              <p className="text-sm text-slate-500">Teléfono</p>
              <p className="font-medium text-slate-800">
                {personalData.phoneNumber}
              </p>
            </div>
            {/* Date of Birth */}
            <div>
              <p className="text-sm text-slate-500">Fecha de nacimiento</p>
              <p className="font-medium text-slate-800">
                {personalData.dateOfBirth}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal for update patient data */}
      <EditPatientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patientData={personalData}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
