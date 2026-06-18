import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { useUserProfileStore } from "@/lib/si/userProfileStore";
import logo from "@/assets/pristine-data-logo.svg";

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
};

const NAV_SECTIONS = [
  {
    label: "SALES CO-PILOT",
    items: [
      { label: "Dashboard", route: "/si/dashboard", icon: "solar:home-2-linear", activeIcon: "solar:home-2-bold" },
      { label: "Playbook", route: "/si/playbook", icon: "solar:notebook-bookmark-linear", activeIcon: "solar:notebook-bookmark-bold" },
      { label: "Watchlist", route: "/si/watchlist", icon: "solar:bell-bing-linear", activeIcon: "solar:bell-bing-bold" },
      { label: "Search", route: "/si/search", icon: "solar:magnifer-linear", activeIcon: "solar:magnifer-bold" },
    ],
  },
];

export function SISidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = useUserProfileStore((s) => s.profile);
  const credits = useUserProfileStore((s) => s.credits);
  const [isDark, setIsDark] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const remainingCredits = Math.max(credits.total - credits.used, 0);
  const creditsLow = credits.used / credits.total >= 0.8;

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
                      (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(99,102,241,0.08)";
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

      {/* Bottom: user + settings dropdown */}
      <div className="border-t px-2 py-3 relative" style={{ borderColor: "var(--si-sidebar-border)" }} ref={profileRef}>
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-[13px] font-medium text-gray-800 truncate">{name || "My Account"}</div>
            {email && <div className="text-[10px] text-gray-400 truncate">{email}</div>}
          </div>
          <Icon
            icon="solar:alt-arrow-up-linear"
            width={14}
            className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${profileOpen ? "" : "rotate-180"}`}
          />
        </button>

        {profileOpen && (
          <div
            className="absolute bottom-full left-2 right-2 mb-1 rounded-lg border shadow-lg py-1 z-50"
            style={{ borderColor: "var(--si-sidebar-border)", backgroundColor: "var(--si-card-bg)" }}
          >
            <div className="px-3 py-2 border-b" style={{ borderColor: "var(--si-sidebar-border)" }}>
              <p className="text-xs font-semibold text-[--si-text-primary] truncate">{name || "My Account"}</p>
              {email && <p className="text-xs text-[--si-text-muted] truncate">{email}</p>}
            </div>
            <button
              onClick={() => { navigate("/si/settings?tab=credits"); setProfileOpen(false); }}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 hover:bg-black/5 transition-colors"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: credits.plan === "pro" ? "#6366F1" : "var(--si-text-secondary)" }}>
                <Icon icon={credits.plan === "pro" ? "solar:crown-bold" : credits.plan === "starter" ? "solar:rocket-bold" : "solar:star-outline"} width={12} />
                {PLAN_LABELS[credits.plan]} plan
              </span>
              <span className="text-xs" style={{ color: creditsLow ? "#EF4444" : "var(--si-text-muted)" }}>
                {remainingCredits.toLocaleString()} / {credits.total.toLocaleString()} credits
              </span>
            </button>
            <button
              onClick={() => { navigate("/si/settings"); setProfileOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[--si-text-secondary] hover:text-[--si-text-primary] hover:bg-black/5 transition-colors"
            >
              <Icon icon="solar:settings-linear" className="h-4 w-4" />
              Settings
            </button>
            <div className="border-t mt-1 pt-1" style={{ borderColor: "var(--si-sidebar-border)" }}>
              <button
                onClick={() => navigate("/sign-in")}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Icon icon="solar:logout-2-linear" className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
