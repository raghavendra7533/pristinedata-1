import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { SILayout } from "./components/si/SILayout";
import SIDashboard from "./pages/si/SIDashboard";
import SIICPDiscovery from "./pages/si/SIICPDiscovery";
import SIWatchlist from "./pages/si/SIWatchlist";
import SISearch from "./pages/si/SISearch";
import SIPlaybook from "./pages/si/SIPlaybook";
import SIPlaybookList from "./pages/si/SIPlaybookList";
import SIAccountView from "./pages/si/SIAccountView";
import SISearchPeopleResults from "./pages/si/SISearchPeopleResults";
import SISearchCompanyResults from "./pages/si/SISearchCompanyResults";
import SISearchResults from "./pages/si/SISearchResults";
import SIPersonPlaybook from "./pages/si/SIPersonPlaybook";
import SIMarketIntelligence from "./pages/si/SIMarketIntelligence";
import SIOnboarding from "./pages/si/SIOnboarding";
import SIOnboardingWizard from "./pages/si/SIOnboardingWizard";
import SILanding from "./pages/si/SILanding";
import SISignUp from "./pages/si/SISignUp";
import SISignIn from "./pages/si/SISignIn";
import SIPricingPage from "./pages/si/SIPricingPage";
import SICreditManagement from "./pages/si/SICreditManagement";
import SISettings from "./pages/si/SISettings";
import OnboardingIntegrations from "./pages/OnboardingIntegrations";
import Dashboard from "./pages/Dashboard";
import TalentDashboard from "./pages/TalentDashboard";
import Search from "./pages/Search";
import SearchResults from "./pages/SearchResults";
import SearchLanding from "./pages/SearchLanding";
import UnifiedFilters from "./pages/UnifiedFilters";
import Insights from "./pages/Insights";
import Results from "./pages/Results";
import AccountSearch from "./pages/AccountSearch";
import ICPFunnel from "./pages/ICPFunnel";
import ContactProfile from "./pages/ContactProfile";
import Opportunities from "./pages/Opportunities";
import CampaignDashboard from "./pages/CampaignDashboard";
import CampaignAnalytics from "./pages/CampaignAnalytics";
import CreateCampaign from "./pages/CreateCampaign";
import NotFound from "./pages/NotFound";
import PersonalizationAssets from "./pages/PersonalizationAssets";
import Integrations from "./pages/Integrations";
import AddIntegration from "./pages/AddIntegration";
import SubscriptionHub from "./pages/SubscriptionHub";
import SubscriptionFuture from "./pages/SubscriptionFuture";
import PricingCalculator from "./pages/PricingCalculator";
import ChromeExtension from "./pages/ChromeExtension";
import SCWorkspace from "./pages/SCWorkspace";
import ContentIQ from "./pages/ContentIQ";
import SalesOpenersMockup from "./pages/SalesOpenersMockup";
import Lists from "./pages/Lists";
import ListDetail from "./pages/ListDetail";
import EnrichLeads from "./pages/EnrichLeads";
import CampaignCalendar from "./pages/CampaignCalendar";
import AdminCampaignCalendar from "./pages/AdminCampaignCalendar";
import AdminCapacityPlanner from "./pages/AdminCapacityPlanner";
import ClientCapacityPlanner from "./pages/ClientCapacityPlanner";
import AccountPlaybook from "./pages/AccountPlaybook";
import Settings from "./pages/Settings";
import Onboarding from "./pages/Onboarding";
import SalesDashboard from "./pages/SalesDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/talent" element={<TalentDashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/search/results" element={<SearchResults />} />
            <Route path="/search-old" element={<SearchLanding />} />
            <Route path="/unified-filters" element={<UnifiedFilters />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/account-search" element={<AccountSearch />} />
            <Route path="/icp-funnel" element={<ICPFunnel />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/opportunities/:id" element={<AccountPlaybook />} />
            <Route path="/results/accounts" element={<Results />} />
            <Route path="/results/contacts" element={<Results />} />
            <Route path="/contact/profile" element={<ContactProfile />} />
            {/* Placeholder routes for menu items */}
            <Route path="/lists" element={<Lists />} />
            <Route path="/lists/:id" element={<ListDetail />} />
            <Route path="/enrich-leads" element={<EnrichLeads />} />
            <Route path="/campaigns" element={<CampaignDashboard />} />
            <Route path="/campaigns/create" element={<CreateCampaign />} />
            <Route path="/campaigns/:id/analytics" element={<CampaignAnalytics />} />
            <Route path="/campaigns/:id/calendar" element={<ClientCapacityPlanner />} />
            <Route path="/campaigns/calendar" element={<CampaignCalendar />} />
            <Route path="/personalization" element={<PersonalizationAssets />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/integrations/add" element={<AddIntegration />} />
            <Route path="/subscription-hub" element={<SubscriptionHub />} />
            <Route path="/subscription-future" element={<SubscriptionFuture />} />
            <Route path="/pricing-calculator" element={<PricingCalculator />} />
            <Route path="/chrome-extension" element={<ChromeExtension />} />
            <Route path="/sc-workspace" element={<SCWorkspace />} />
            <Route path="/content-iq" element={<ContentIQ />} />
            <Route path="/sales-openers-mockup" element={<SalesOpenersMockup />} />
            <Route path="/admin" element={<Settings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin-capacity" element={<AdminCapacityPlanner />} />
            <Route path="/admin-capacity/:clientId" element={<ClientCapacityPlanner />} />
            <Route path="/sales-dashboard" element={<SalesDashboard />} />
          </Route>
          {/* Standalone admin routes — no AppLayout wrapper */}
          <Route path="/admin/campaign-calendar" element={<AdminCampaignCalendar />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding/integrations" element={<OnboardingIntegrations />} />
          {/* SI Product Routes */}
          <Route path="/si/onboarding" element={<SIOnboarding />} />
          <Route path="/si/onboard" element={<SIOnboardingWizard />} />
          <Route path="/si/start" element={<SIOnboardingWizard />} />
          <Route path="/landing" element={<SILanding />} />
          {/* Replaced by SIOnboardingWizard — kept for reference */}
          {/* <Route path="/sign-up" element={<SISignUp />} /> */}
          <Route path="/signup" element={<SIOnboarding />} />
          <Route path="/sign-in" element={<SISignIn />} />
          <Route element={<SILayout />}>
            <Route path="/si" element={<Navigate to="/si/dashboard" replace />} />
            <Route path="/si/dashboard" element={<SIDashboard />} />
            <Route path="/si/search" element={<SISearch />} />
            <Route path="/si/search/results" element={<SISearchResults />} />
            <Route path="/si/search/results/people" element={<SISearchPeopleResults />} />
            <Route path="/si/search/results/companies" element={<SISearchCompanyResults />} />
            <Route path="/si/icp" element={<Navigate to="/si/search" replace />} />
            <Route path="/si/watchlist" element={<SIWatchlist />} />
            <Route path="/si/watchlist/:accountId" element={<SIAccountView />} />
            <Route path="/si/accounts/:accountId" element={<SIAccountView />} />
            <Route path="/si/playbook/person/:personId" element={<SIPersonPlaybook />} />
            <Route path="/si/playbook/:accountId" element={<SIPlaybook />} />
            <Route path="/si/playbook" element={<SIPlaybookList />} />
            <Route path="/si/settings" element={<SISettings />} />
            <Route path="/si/mcp" element={<Navigate to="/si/settings?tab=mcp" replace />} />
            <Route path="/si/market-intelligence" element={<SIMarketIntelligence />} />
            <Route path="/si/integrations" element={<Navigate to="/si/settings?tab=integrations" replace />} />
            <Route path="/si/pricing" element={<SIPricingPage />} />
            <Route path="/si/credits" element={<Navigate to="/si/settings?tab=credits" replace />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
