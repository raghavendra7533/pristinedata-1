import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useUserProfileStore } from "@/lib/si/userProfileStore";
import logo from "@/assets/pristine-data-logo.svg";

const NAV_SECTIONS = [
  {
    label: "INTELLIGENCE",
    items: [
      { label: "Dashboard", route: "/si/dashboard", icon: "solar:home-2-linear", activeIcon: "solar:home-2-bold" },
      { label: "Search", route: "/si/search", icon: "solar:magnifer-linear", activeIcon: "solar:magnifer-bold" },
      { label: "ICP Discovery", route: "/si/icp", icon: "solar:target-linear", activeIcon: "solar:target-bold" },
      { label: "Watchlist", route: "/si/watchlist", icon: "solar:bell-bing-linear", activeIcon: "solar:bell-bing-bold" },
      { label: "Playbook", route: "/si/playbook", icon: "solar:notebook-bookmark-linear", activeIcon: "solar:notebook-bookmark-bold" },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { label: "Settings", route: "/si/mcp", icon: "solar:settings-linear", activeIcon: "solar:settings-bold" },
    ],
  },
];

export function SISidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = useUserProfileStore((s) => s.profile);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  function toggleDark() {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }
  const name = profile?.name ?? "";
  const email = profile?.email ?? "";

  const isActive = (route: string) =>
    location.pathname.startsWith(route + "/") || location.pathname === route;

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <aside
      className="flex flex-col h-screen w-[220px] flex-shrink-0 border-r"
      style={{
        backgroundColor: "var(--si-sidebar-bg)",
        borderColor: "var(--si-sidebar-border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center px-4 py-4 border-b" style={{ borderColor: "var(--si-sidebar-border)" }}>
        <img src={logo} alt="Pristine Data" className="h-6 w-auto" />
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            <div
              className="text-[10px] font-semibold tracking-widest px-3 mb-1.5"
              style={{ color: "var(--si-sidebar-section-label)" }}
            >
              {section.label}
            </div>
            {section.items.map((item) => {
              const active = isActive(item.route);
              return (
                <NavLink
                  key={item.route}
                  to={item.route}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all mb-0.5"
                  style={{
                    color: active ? "var(--si-sidebar-active-text)" : "var(--si-sidebar-text)",
                    backgroundColor: active ? "var(--si-sidebar-active-bg)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "#F3F4F6";
                      (e.currentTarget as HTMLElement).style.color = "var(--si-sidebar-text-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "var(--si-sidebar-text)";
                    }
                  }}
                >
                  <Icon
                    icon={active ? item.activeIcon : item.icon}
                    width={16}
                    className="flex-shrink-0"
                  />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Dark mode toggle */}
      <div className="px-3 py-2">
        <button
          onClick={toggleDark}
          className="flex items-center gap-2.5 w-full rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors hover:bg-white/10"
          style={{ color: "var(--si-sidebar-text)" }}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <Icon icon={isDark ? "solar:sun-linear" : "solar:moon-linear"} width={15} className="flex-shrink-0" />
          {isDark ? "Light mode" : "Dark mode"}
        </button>
      </div>

      {/* Bottom: user + sign out */}
      <div className="border-t px-2 py-3" style={{ borderColor: "var(--si-sidebar-border)" }}>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer group">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-gray-800 truncate">{name || "My Account"}</div>
            {email && <div className="text-[10px] text-gray-400 truncate">{email}</div>}
          </div>
          <button
            onClick={() => navigate("/sign-in")}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            title="Sign out"
          >
            <Icon icon="solar:logout-2-linear" width={14} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>
    </aside>
  );
}
