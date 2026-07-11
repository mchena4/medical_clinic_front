export default function Sidebar({ onChangeView, onLogout }) {
  return (
    // Sidebar container
    <aside className="w-70 h-screen bg-white border-r border-slate-200 flex flex-col font-sans shadow-[2px_0_10px_rgba(0,0,0,0.03)] ">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-slate-900 text-xl font-semibold m-0">
          Clinica Medica
        </h2>
        <h3 className="text-slate-600 text-lg font-semibold ml-4">
          Consultorios
        </h3>
      </div>

      {/* Navigation */}
      <nav className="grow py-5 px-3">
        <ul className="flex flex-col gap-2 m-0 p-0 list-none">
          {/* Personal Data */}
          <li>
            <button
              onClick={() => onChangeView("my-data")}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 font-medium rounded-lg no-underline transition-colors duration-200 hover:bg-sky-50 hover:text-sky-600"
            >
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
              Mis datos personales
            </button>
          </li>

          {/* My Appointments */}
          <li>
            <button
              onClick={() => onChangeView("my-appointments")}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 font-medium rounded-lg no-underline transition-colors duration-200 hover:bg-sky-50 hover:text-sky-600"
            >
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
              Mis Turnos
            </button>
          </li>

          {/* Doctors */}
          <li>
            <button
              onClick={() => onChangeView("doctors")}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 font-medium rounded-lg no-underline transition-colors duration-200 hover:bg-sky-50 hover:text-sky-600"
            >
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
              Doctores
            </button>
          </li>
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
