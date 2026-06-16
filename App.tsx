import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { BettingProvider } from "./contexts/BettingContext";
import { BettingSlip } from "./components/BettingSlip";
import MobileBottomNav from "./components/MobileBottomNav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LiveBetting from "./pages/LiveBetting";
import PreGameBetting from "./pages/PreGameBetting";
import CasinoPage from "./pages/Casino";
import Support from "./pages/Support";
import Deposit from "./pages/Deposit";
import Withdrawal from "./pages/Withdrawal";
import UserDashboard from "./pages/UserDashboard";
import AdminPanel from "./pages/AdminPanel";
import BettingSlipPage from "./pages/BettingSlipPage";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/live"} component={LiveBetting} />
      <Route path={"/pre-game"} component={PreGameBetting} />
      <Route path={"/casino"} component={CasinoPage} />
      <Route path={"/support"} component={Support} />
      <Route path={"/deposit"} component={Deposit} />
      <Route path={"/withdrawal"} component={Withdrawal} />
      <Route path={"/dashboard"} component={UserDashboard} />
      <Route path={"/admin"} component={AdminPanel} />
      <Route path={"/betting-slip"} component={BettingSlipPage} />
      <Route path={"/affiliate"} component={AffiliateDashboard} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <BettingProvider>
            <TooltipProvider>
              <Toaster />
              <div className="flex flex-col min-h-screen">
                <div className="flex-1">
                  <Router />
                </div>
                <Footer />
              </div>
              <BettingSlip />
              <MobileBottomNav />
            </TooltipProvider>
          </BettingProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
