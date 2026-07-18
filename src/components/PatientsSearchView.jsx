"use client";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function PatientsSearchView() {
  // Patient data, loading and search states
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  //   Fetch patients from the backend when the component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Call API to get patients
        const response = await api.get("/Patients/GetPatients");
        setPatients(response.data);
      } catch (error) {
        console.error("Error al obtener pacientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter by search query (name, surname, or DNI)
  const filteredPatients = patients.filter((p) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    return fullName.includes(query) || p.dni?.includes(query);
  });

  if (loading)
    return (
      <div className="text-slate-500">Cargando directorio de pacientes...</div>
    );

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Directorio de Pacientes
      </h2>

      {/* Searchbar */}
      <div className="mb-6 max-w-xl">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o DNI..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
        />
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          {/* Patient info */}
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm">
              <th className="py-3 px-4 font-semibold border-b border-slate-200">
                Nombre Completo
              </th>
              <th className="py-3 px-4 font-semibold border-b border-slate-200">
                DNI
              </th>
              <th className="py-3 px-4 font-semibold border-b border-slate-200">
                Teléfono
              </th>
              <th className="py-3 px-4 font-semibold border-b border-slate-200">
                Fecha de Nacimiento
              </th>
            </tr>
          </thead>
          {/* Patient rows */}
          <tbody>
            {/* Check patients */}
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-500">
                  No se encontraron pacientes que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              // List of patients
              filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                >
                  {/* Full name */}
                  <td className="py-3 px-4 text-slate-800 font-medium">
                    {patient.firstName} {patient.lastName}
                  </td>
                  {/* DNI */}
                  <td className="py-3 px-4 text-slate-600">{patient.dni}</td>
                  {/* Phone number */}
                  <td className="py-3 px-4 text-slate-600">
                    {patient.phoneNumber || "-"}
                  </td>
                  {/* Date of birth */}
                  <td className="py-3 px-4 text-slate-600">
                    {patient.dateOfBirth
                      ? patient.dateOfBirth.split("T")[0]
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
