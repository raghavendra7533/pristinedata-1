import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
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
      <header className="border-b border-border/40 bg-background/80 glass-nav sticky top-0 z-50">
        <div className="flex items-center justify-between h-12 px-6 max-w-6xl mx-auto w-full">
          {/* Logo + Nav */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 hover:opacity-70 transition-opacity mr-3"
            >
              <img src={pristineDataLogo} alt="Pristine Data AI" className="h-7 w-auto" />
            </button>

            {!isHome && (
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Icon icon="solar:home-linear" className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}

            <button
              onClick={() => navigate("/search")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Icon icon="solar:magnifer-linear" className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <Icon icon="solar:hamburger-menu-linear" className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => navigate("/lists")} className="text-xs gap-2">
                  <Icon icon="solar:documents-linear" className="h-3.5 w-3.5" />
                  Lists
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/campaigns")} className="text-xs gap-2">
                  <Icon icon="solar:megaphone-linear" className="h-3.5 w-3.5" />
                  Campaigns
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/integrations")} className="text-xs gap-2">
                  <Icon icon="solar:link-linear" className="h-3.5 w-3.5" />
                  Integrations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/subscription-hub")} className="text-xs gap-2">
                  <Icon icon="solar:card-linear" className="h-3.5 w-3.5" />
                  Subscription Hub
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/admin")} className="text-xs gap-2">
                  <Icon icon="solar:settings-linear" className="h-3.5 w-3.5" />
                  Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 rounded-full">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                      JR
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem className="text-xs gap-2">
                  <Icon icon="solar:user-linear" className="h-3.5 w-3.5" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
