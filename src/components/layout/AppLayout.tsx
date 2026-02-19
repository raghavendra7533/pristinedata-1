import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home, Menu, User, List, Megaphone, Settings, Link2, Search, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import pristineDataLogo from "@/assets/pristine-data-logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Glass Navigation — design system spec */}
      <header className="fixed w-full z-50 top-0 glass-nav bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/60 dark:border-slate-800/60 transition-all duration-300">
        <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto w-full">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src={pristineDataLogo}
                alt="Pristine Data AI"
                className="h-8 w-auto"
              />
            </button>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {!isHome && (
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                  <Home className="h-3.5 w-3.5" />
                  Home
                </button>
              )}
              <button
                onClick={() => navigate("/search")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                <Search className="h-3.5 w-3.5" />
                Search
              </button>
              <button
                onClick={() => navigate("/campaigns")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                <Megaphone className="h-3.5 w-3.5" />
                Campaigns
              </button>
            </nav>
          </div>

          {/* Right: Menu + Profile */}
          <div className="flex items-center gap-2">
            {/* Secondary Navigation */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                  <Menu className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg">
                <DropdownMenuItem onClick={() => navigate("/lists")} className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                  <List className="h-3.5 w-3.5 mr-2" />
                  Lists
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/integrations")} className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                  <Link2 className="h-3.5 w-3.5 mr-2" />
                  Integrations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/subscription-hub")} className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                  <CreditCard className="h-3.5 w-3.5 mr-2" />
                  Subscription
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                <DropdownMenuItem onClick={() => navigate("/admin")} className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                  <Settings className="h-3.5 w-3.5 mr-2" />
                  Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* CTA Button */}
            <button
              onClick={() => navigate("/search")}
              className="hidden sm:flex px-3.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-lg transition-all shadow-sm hover:bg-slate-800 dark:hover:bg-slate-200 hover:scale-[1.02] items-center gap-1.5"
            >
              <Search className="h-3.5 w-3.5" />
              New Search
            </button>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full hover:opacity-80 transition-opacity">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      JR
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DropdownMenuItem className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  <User className="h-3.5 w-3.5 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                <DropdownMenuItem className="text-xs font-medium text-slate-700 dark:text-slate-300">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content — offset for fixed nav */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
    </div>
  );
}
