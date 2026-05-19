import { Outlet, Navigate } from "react-router-dom";
import { SISidebar } from "./shared/SISidebar";
import { useUserProfileStore } from "@/lib/si/userProfileStore";

export function SILayout() {
  const onboardingCompleted = useUserProfileStore((s) => s.onboardingCompleted);

  if (!onboardingCompleted) {
    return <Navigate to="/si/onboarding" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden" data-theme="si">
      {/* Sidebar: fixed height, never scrolls */}
      <SISidebar />
      {/* Main content: scrollable */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ backgroundColor: "var(--si-bg)" }}
      >
        <Outlet />
      </div>
    </div>
  );
}
