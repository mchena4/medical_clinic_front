// Icons for the sidebar menu
const UserIcon = (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CalendarIcon = (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const SearchUsersIcon = (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const StethoscopeIcon = (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
    <circle cx="20" cy="10" r="2"></circle>
  </svg>
);

// Configuration for the sidebar menu based on user roles
const MENU_CONFIG = {
  Patient: [
    { id: "my-data", label: "Mis datos personales", icon: UserIcon },
    { id: "my-appointments", label: "Mis Turnos", icon: CalendarIcon },
    { id: "doctors", label: "Doctores", icon: StethoscopeIcon },
  ],
  Doctor: [
    { id: "doctor-appointments", label: "Mi Agenda", icon: CalendarIcon },
    { id: "search-patients", label: "Buscar Pacientes", icon: SearchUsersIcon },
  ],
  Receptionist: [
    { id: "all-appointments", label: "Gestión de Turnos", icon: CalendarIcon },
    { id: "doctors", label: "Directorio Médico", icon: StethoscopeIcon },
    { id: "search-patients", label: "Pacientes", icon: SearchUsersIcon },
  ],
};

// Sidebar component that renders the navigation menu based on the user's role
export default function Sidebar({
  onChangeView,
  onLogout,
  userRole = "Patient",
  activeView,
}) {
  // Get the current menu based on the user role
  const currentMenu = MENU_CONFIG[userRole] || [];

  return (
    <aside className="w-70 h-screen bg-white border-r border-slate-200 flex flex-col font-sans shadow-[2px_0_10px_rgba(0,0,0,0.03)]">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-slate-900 text-xl font-semibold m-0">
          Clinica Medica
        </h2>
        <h3 className="text-slate-600 text-lg font-semibold ml-4">
          Consultorios
        </h3>
      </div>

      <nav className="grow py-5 px-3">
        <ul className="flex flex-col gap-2 m-0 p-0 list-none">
          {/* Navigation */}
          {currentMenu.map((item) => {
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onChangeView(item.id)}
                  // Dynamic classes based on active state (change button and icon colors)
                  className={`flex items-center gap-3 px-4 py-3 font-medium rounded-lg no-underline transition-colors duration-200 w-full text-left
                    ${
                      isActive
                        ? "bg-sky-50 text-sky-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-sky-600"
                    }
                  `}
                >
                  <div className={isActive ? "text-sky-600" : "text-slate-400"}>
                    {item.icon}
                  </div>
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="p-5 px-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2.5 w-full p-3 bg-transparent text-red-500 border border-red-100 rounded-lg text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-red-50 hover:border-red-300"
        >
          <svg
            className="w-4.5 h-4.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
