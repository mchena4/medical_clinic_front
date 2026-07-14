"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import MyAppointmentsView from "../../components/MyAppointmentsView";
import DoctorsView from "../../components/DoctorsView";
import PersonalData from "../../components/PersonalData";

export default function DashboardPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState("my-appointments");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Session verification
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Switch function for render the correct view
  const renderContent = () => {
    switch (activeView) {
      case "my-data":
        return <PersonalData />;
      case "my-appointments":
        return <MyAppointmentsView />;
      case "doctors":
        return <DoctorsView />;
      default:
        return <MyAppointmentsView />;
    }
  };

  // Loading state while checking authentication
  if (isCheckingAuth) {
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
        onLogout={handleLogout}
      />

      {/* Content View */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
