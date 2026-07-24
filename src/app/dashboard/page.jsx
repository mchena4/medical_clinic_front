"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Components
import Sidebar from "../../components/Sidebar";
import MyAppointmentsView from "../../components/MyAppointmentsView";
import DoctorsView from "../../components/DoctorsView";
import PersonalData from "../../components/PersonalData";
import DoctorAppointmentsView from "@/components/DoctorAppointmentsView";
import PatientsSearchView from "@/components/PatientsSearchView";
import AllAppointmentsView from "@/components/AllAppointmets";

// Auth context
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();

  const { user, isLoadingAuth, logout } = useAuth();
  const [activeView, setActiveView] = useState("");

  // Session verification
  useEffect(() => {
    if (!isLoadingAuth) {
      if (!user) {
        router.push("/login");
      } else if (activeView === "") {
        // View depending user role
        if (user.role === "Patient") setActiveView("my-appointments");
        if (user.role === "Doctor") setActiveView("doctor-appointments");
        if (user.role === "Receptionist") setActiveView("all-appointments");
      }
    }
  }, [user, isLoadingAuth, router, activeView]);

  const renderContent = () => {
    switch (activeView) {
      // Patient view
      case "my-data":
        return <PersonalData />;
      case "my-appointments":
        return <MyAppointmentsView />;
      case "doctors":
        return <DoctorsView />;
      // Doctor view
      case "doctor-appointments":
        return <DoctorAppointmentsView />;
      case "search-patients":
        return <PatientsSearchView />;
      // Receptionist view
      case "all-appointments":
        return <AllAppointmentsView />;
    }
  };

  // Loading state while checking authentication
  if (isLoadingAuth || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-9 h-9 rounded-full border-[3px] border-slate-200 animate-spin border-t-sky-600" />
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Menu */}
      <Sidebar
        activeView={activeView}
        onChangeView={setActiveView}
        onLogout={logout}
        userRole={user.role}
      />

      {/* Content View */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
