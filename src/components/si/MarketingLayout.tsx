import { NavLink } from "react-router-dom";
import logo from "@/assets/pristine-data-logo.svg";

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E7EB] h-14 flex items-center justify-between px-6">
        <div className="flex items-center">
          <img src={logo} alt="Pristine Data" height={28} className="h-7 w-auto" />
        </div>
        <NavLink
          to="/sign-in"
          className="text-sm font-medium text-[#6B7280] hover:text-[#0F0F0F] transition-colors"
        >
          Sign in
        </NavLink>
      </nav>

      {/* Content below fixed nav */}
      <div className="pt-14">{children}</div>
    </div>
  );
}
