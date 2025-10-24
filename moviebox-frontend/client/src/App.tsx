import React, { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import { Loader2 } from "lucide-react";
import HomePage from "@/pages/home-page";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Lazy load pages for code splitting
const BrowsePage = lazy(() => import("@/pages/browse-page"));
const MovieDetailsPage = lazy(() => import("@/pages/movie-details-page"));
const TVShowDetailsPage = lazy(() => import("@/pages/tv-show-details-page"));
const SeasonDetailsPage = lazy(() => import("@/pages/season-details-page"));
const EpisodeDetailsPage = lazy(() => import("@/pages/episode-details-page"));
const PersonDetailsPage = lazy(() => import("@/pages/person-details-page"));
const SearchResultsPage = lazy(() => import("@/pages/search-results-page"));
const WatchlistPage = lazy(() => import("@/pages/watchlist-page"));
const AuthPage = lazy(() => import("@/pages/auth-page"));
const NotFound = lazy(() => import("@/pages/not-found"));
const GenreResultsPage = lazy(() => import("@/pages/genre-results-page"));
const NotificationsPage = lazy(() => import("@/pages/notifications-page"));
const UserProfilePage = lazy(() => import("@/pages/user-profile-page"));
const ReviewsPage = lazy(() => import("@/pages/reviews-page"));
const WatchHistoryPage = lazy(() => import("@/pages/watch-history-page"));
import { ProtectedRoute } from "./lib/protected-route";
import Header from "./components/layout/header";
import { useSocket } from "./hooks/useSocket";
import { toast } from "./hooks/use-toast";
import Footer from "./components/layout/footer";
import MobileNavigation from "./components/layout/mobile-navigation";
import { ErrorBoundary } from "./components/ui/error-boundary";
import { useLocation } from "wouter";
import { useGlobalShortcuts } from "./hooks/use-keyboard-shortcuts";
import { analytics } from "./lib/analytics";

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/browse" component={BrowsePage} />
        <Route path="/movie/:id" component={MovieDetailsPage} />
        <Route path="/tvshow/:id" component={TVShowDetailsPage} />
        <Route path="/season/:id" component={SeasonDetailsPage} />
        <Route path="/episode/:id" component={EpisodeDetailsPage} />
        <Route path="/person/:id" component={PersonDetailsPage} />
        <Route path="/search" component={SearchResultsPage} />
        <Route path="/watchlist" component={WatchlistPage} />
        <Route path="/notifications" component={NotificationsPage} />
        <Route path="/profile/:id" component={UserProfilePage} />
        <Route path="/profile" component={UserProfilePage} />
        <Route path="/reviews" component={ReviewsPage} />
        <Route path="/watch-history" component={WatchHistoryPage} />
        <Route path="/content/genre/:genre" component={GenreResultsPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const { isConnected, socket } = useSocket();
  const [location, navigate] = useLocation();

  // Initialize analytics
  React.useEffect(() => {
    analytics.initialize();
  }, []);

  // Track page views
  React.useEffect(() => {
    analytics.trackPageView(location);
  }, [location]);

  // Global keyboard shortcuts
  useGlobalShortcuts(navigate);

  // Socket notifications
  React.useEffect(() => {
    function onNewNotification(notification: any) {
      toast({ title: "New Notification", description: notification.message });
    }

    socket.on('newNotification', onNewNotification);

    return () => {
      socket.off('newNotification', onNewNotification);
    };
  }, [socket]);

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <div className="relative flex flex-col min-h-screen">
          <Header isConnected={isConnected} />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
          <MobileNavigation />
        </div>
        <Toaster />
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
