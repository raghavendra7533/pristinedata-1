import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import pristineDataLogo from "@/assets/pristine-data-logo.svg";

type Product = "outbound" | "si" | "shared";

interface NavItem {
  icon: string;
  activeIcon: string;
  label: string;
  route?: string;
  product: Product;
  children?: { label: string; route: string; icon: string }[];
}

interface SidebarSection {
  label: string;
  items: NavItem[];
}

// Replace with userProfileStore.planState in production
const USER_PLAN: "outbound_only" | "si_only" | "both" = "both"; // change to test

const sidebarSections: SidebarSection[] = [
  {
    label: "PLATFORM",
    items: [
      { icon: "solar:home-2-linear", activeIcon: "solar:home-2-bold", label: "Home", route: "/", product: "shared" },
      { icon: "solar:magnifer-linear", activeIcon: "solar:magnifer-bold", label: "Search", route: "/search", product: "shared" },
    ],
  },
  {
    label: "OUTBOUND OS",
    items: [
      {
        icon: "solar:target-linear",
        activeIcon: "solar:target-bold",
        label: "Prospecting",
        product: "outbound",
        children: [
          { label: "Lead Search", route: "/search", icon: "solar:magnifer-linear" },
          { label: "Lists", route: "/lists", icon: "solar:documents-linear" },
          { label: "Enrich Leads", route: "/enrich-leads", icon: "solar:magic-stick-3-linear" },
        ],
      },
      {
        icon: "solar:magic-stick-3-linear",
        activeIcon: "solar:magic-stick-3-bold",
        label: "Personalization",
        product: "outbound",
        children: [
          { label: "Sequence Builder", route: "/campaigns/create", icon: "solar:widget-linear" },
          { label: "Campaign Analytics", route: "/campaigns", icon: "solar:chart-linear" },
          { label: "Content HQ", route: "/personalization", icon: "solar:layers-linear" },
        ],
      },
    ],
  },
  {
    label: "SALES INTELLIGENCE",
    items: [
      {
        icon: "solar:lightbulb-linear",
        activeIcon: "solar:lightbulb-bold",
        label: "Sales Intelligence",
        product: "si",
        children: [
          { label: "Sales Dashboard", route: "/sales-dashboard", icon: "solar:chart-square-linear" },
          { label: "Opportunity Playbook", route: "/opportunities", icon: "solar:bolt-linear" },
          { label: "Account Intelligence", route: "/account-search", icon: "solar:graph-up-linear" },
          { label: "Buying Signals", route: "/signals", icon: "solar:radar-linear" },
        ],
      },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { icon: "solar:link-linear", activeIcon: "solar:link-bold", label: "Integrations", route: "/integrations", product: "shared" },
    ],
  },
];

function isProductVisible(product: Product): boolean {
  if (USER_PLAN === "both" || product === "shared") return true;
  if (USER_PLAN === "outbound_only") return product === "outbound";
  return product === "si";
}

const visibleSidebarSections: SidebarSection[] = sidebarSections
  .map((section) => ({
    ...section,
    items: section.items.filter((item) => isProductVisible(item.product)),
  }))
  .filter((section) => section.items.length > 0);

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
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

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    const fontSizes: Record<string, string> = { sm: "13px", md: "15px", lg: "17px" };
    const saved = localStorage.getItem("fontSize") ?? "md";
    document.documentElement.style.setProperty("--font-size-base", fontSizes[saved] ?? "15px");
  }, []);

  // Auto-expand parent if child route is active
  useEffect(() => {
    visibleSidebarSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some((child) =>
            location.pathname === child.route || location.pathname.startsWith(child.route + "/")
          );
          if (hasActiveChild && !expandedItems.includes(item.label)) {
            setExpandedItems((prev) => [...prev, item.label]);
          }
        }
      });
    });
  }, [location.pathname]);

  const toggleTheme = () => setIsDark(!isDark);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (route: string) => {
    if (route === "/") return location.pathname === "/";
    // Exact match check - prevents /campaigns from matching /campaigns/create
    if (location.pathname === route) return true;
    // For sub-routes, only match if it's a true child path (not a sibling like /campaigns/create vs /campaigns)
    // Check that it's not another defined route that happens to start with this path
    if (location.pathname.startsWith(route + "/")) {
      // Don't match /campaigns for /campaigns/create since they're siblings in nav
      const defined = ["/campaigns", "/campaigns/create"];
      const isDefinedSibling = defined.some(
        (r) => r !== route && location.pathname.startsWith(r)
      );
      return !isDefinedSibling;
    }
    return false;
  };

  const isParentActive = (item: NavItem) => {
    if (item.children) {
      return item.children.some((child) => isActive(child.route));
    }
    return item.route ? isActive(item.route) : false;
  };

  const getPageTitle = () => {
    if (location.pathname === "/") return "Home";
    if (location.pathname.startsWith("/search")) return "Search";
    if (location.pathname.startsWith("/campaigns/create")) return "Sequence Builder";
    if (location.pathname.startsWith("/campaigns")) return "Campaign Analytics";
    if (location.pathname.startsWith("/opportunities")) return "Opportunity Playbook";
    if (location.pathname.startsWith("/lists")) return "Lists";
    if (location.pathname.startsWith("/integrations")) return "Integrations";
    if (location.pathname.startsWith("/personalization")) return "Content HQ";
    if (location.pathname.startsWith("/account-search")) return "Account Intelligence";
    if (location.pathname.startsWith("/enrich-leads")) return "Enrich Leads";
    if (location.pathname.startsWith("/signals")) return "Buying Signals";
    if (location.pathname.startsWith("/sales-dashboard")) return "Sales Intelligence";
    return "";
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-border bg-card h-screen sticky top-0 overflow-y-auto">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-border">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <img src={pristineDataLogo} alt="PristineData AI" className="h-7 w-auto" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {visibleSidebarSections.map((section) => (
            <div key={section.label} className="mb-5">
              <p className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.label}
              </p>
              {section.items.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedItems.includes(item.label);
                const parentActive = isParentActive(item);

                return (
                  <div key={item.label}>
                    {/* Parent item */}
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          toggleExpanded(item.label);
                        } else if (item.route) {
                          navigate(item.route);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-all duration-150 ${
                        parentActive && !hasChildren
                          ? "bg-primary/10 text-primary border-r-2 border-primary"
                          : parentActive && hasChildren
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon
                          icon={parentActive ? item.activeIcon : item.icon}
                          className={`h-4 w-4 flex-shrink-0 ${parentActive ? "text-primary" : ""}`}
                        />
                        {item.label}
                      </span>
                      {hasChildren && (
                        <Icon
                          icon="solar:alt-arrow-down-linear"
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Children */}
                    {hasChildren && isExpanded && (
                      <div className="ml-4 pl-2.5 border-l border-border/50 mt-1 mb-2">
                        {item.children!.map((child) => {
                          const childActive = isActive(child.route);
                          return (
                            <button
                              key={child.label}
                              onClick={() => navigate(child.route)}
                              className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                                childActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
                              }`}
                            >
                              <Icon icon={child.icon} className="h-3.5 w-3.5" />
                              {child.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Cross-sell callout */}
        {USER_PLAN === "outbound_only" && (
          <div className="px-3 pb-3">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs font-medium text-foreground">Get Account Intelligence</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 mb-2 leading-snug">
                Track buying signals and build playbooks for target accounts.
              </p>
              <button
                onClick={() => navigate("/pricing")}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 text-xs font-medium transition-colors"
              >
                Try Sales Intelligence
              </button>
            </div>
          </div>
        )}
        {USER_PLAN === "si_only" && (
          <div className="px-3 pb-3">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs font-medium text-foreground">Run Outbound Campaigns</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 mb-2 leading-snug">
                Sequence builder, campaign analytics, and AI-powered personalization.
              </p>
              <button
                onClick={() => navigate("/pricing")}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 text-xs font-medium transition-colors"
              >
                Try Outbound OS
              </button>
            </div>
          </div>
        )}

        {/* Bottom — User */}
        <div className="border-t border-border p-3 relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-2.5 hover:bg-accent rounded-md px-1 py-1 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground text-xs font-bold">SG</span>
              </div>
              <div className="min-w-0 text-left">
                <p className="text-sm font-semibold text-foreground truncate">Single Grain</p>
                <p className="text-xs text-muted-foreground truncate">Pro Plan</p>
              </div>
            </div>
            <Icon
              icon="solar:alt-arrow-up-linear"
              className={`h-3.5 w-3.5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${profileOpen ? "" : "rotate-180"}`}
            />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-1 rounded-lg border border-border bg-card shadow-lg py-1 z-50">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs font-semibold text-foreground">Single Grain</p>
                <p className="text-xs text-muted-foreground">admin@singlegrain.com</p>
              </div>
              <button
                onClick={() => { navigate("/settings"); setProfileOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Icon icon="solar:settings-linear" className="h-4 w-4" />
                Settings
              </button>
              <div className="border-t border-border mt-1 pt-1">
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Icon icon="solar:logout-2-linear" className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
        {import.meta.env.DEV && (
          <div className="px-3 pb-3">
            <button
              onClick={() => {
                localStorage.removeItem("pristine_onboarding");
                localStorage.removeItem("pristine_onboarded");
                navigate("/onboarding");
              }}
              className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors py-1.5 px-2 rounded border border-border hover:border-destructive/50 text-center"
            >
              Reset onboarding
            </button>
          </div>
        )}
      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card flex-shrink-0">
          <h1 className="text-sm font-semibold text-foreground">
            {getPageTitle()}
          </h1>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Icon icon="solar:magnifer-linear" className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search leads, lists..."
                className="h-8 pl-9 pr-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-48 transition-all"
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <Icon icon={isDark ? "solar:sun-linear" : "solar:moon-linear"} className="h-4 w-4" />
            </button>

            {/* Notifications */}
            <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Icon icon="solar:bell-linear" className="h-4 w-4" />
            </button>

            {/* New Campaign CTA */}
            <button
              onClick={() => navigate("/campaigns/create")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-lg transition-all shadow-sm"
            >
              <Icon icon="solar:add-circle-linear" className="h-4 w-4" />
              New Campaign
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
