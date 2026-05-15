import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { SignalFeed } from "@/components/sales-dashboard/SignalFeed";
import { OpenPlaybooks } from "@/components/sales-dashboard/OpenPlaybooks";
import { WatchlistSummary } from "@/components/sales-dashboard/WatchlistSummary";
import { SuggestedAccounts } from "@/components/sales-dashboard/SuggestedAccounts";
import { QuickActions } from "@/components/sales-dashboard/QuickActions";
import { AddToWatchlistModal } from "@/components/sales-dashboard/AddToWatchlistModal";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function SalesDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("there");
  const [modalOpen, setModalOpen] = useState(false);

  // Guard: redirect to onboarding if not completed
  useEffect(() => {
    if (localStorage.getItem("pristine_onboarded") !== "true") {
      navigate("/onboarding");
    }
  }, [navigate]);

  // Read name from onboarding data
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pristine_onboarding");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setUserName(parsed.name.split(" ")[0]);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here's what's happening in your pipeline today.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Icon icon="solar:add-circle-linear" className="h-4 w-4 mr-2" />
          Add Account to Watchlist
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon icon="solar:radar-linear" className="h-4 w-4 text-primary" />
              Signal Feed
            </h2>
            <SignalFeed />
          </div>
          <OpenPlaybooks />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <WatchlistSummary />
          <SuggestedAccounts />
          <QuickActions onAddToWatchlist={() => setModalOpen(true)} />
        </div>
      </div>

      <AddToWatchlistModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
