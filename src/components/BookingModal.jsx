export default function BookingModal({
  // Props
  doctor,
  appointmentDate,
  availableSlots,
  selectedTime,
  loadingSlots,
  booking,
  bookingStatus,
  onClose,
  onDateChange,
  onSelectTime,
  onSubmit,
}) {
  const isSuccess = bookingStatus.includes("éxito");

  return (
    <div
      className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-120 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Agendar Turno</h2>
            <p className="text-sm text-slate-500 mt-1">
              con {doctor?.name}
              {doctor?.specialty && (
                <span className="font-semibold"> · {doctor.specialty}</span>
              )}
            </p>
          </div>
          {/* Close button */}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer p-1 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="px-6 pt-5 pb-6 flex flex-col gap-5"
        >
          {/* Date picker */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-700">
              Fecha de la consulta
            </label>
            <input
              type="date"
              value={appointmentDate}
              onChange={onDateChange}
              min={new Date().toISOString().split("T")[0]}
              required
              className="px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none font-sans"
            />
          </div>

          {/* Slots */}
          {loadingSlots && (
            <p className="text-sm text-slate-400 text-center py-3">
              Buscando horarios disponibles…
            </p>
          )}

          {/* Available Slots */}
          {!loadingSlots && availableSlots.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Horario disponible
              </label>
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onSelectTime(slot)}
                    className="py-2 text-xs font-medium rounded-lg border cursor-pointer transition-all bg-red-400"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          {bookingStatus && (
            <div
              className={`px-4 py-3 rounded-lg text-sm font-medium ${
                isSuccess ? "bg-green-400" : "bg-red-50 text-red-600"
              }`}
            >
              {bookingStatus}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-1">
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            {/* Confirm button */}
            <button
              type="submit"
              disabled={!selectedTime || booking}
              className={`px-5 py-2.5 text-white text-sm font-semibold rounded-lg border-0 transition-opacity
              ${
                !selectedTime || booking
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100 cursor-pointer bg-teal-500 hover:bg-teal-600"
              }`}
            >
              {booking ? "Agendando…" : "Confirmar turno"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
