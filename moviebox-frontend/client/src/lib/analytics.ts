// Analytics utility for tracking user interactions
// Can be integrated with Google Analytics, Mixpanel, or custom analytics

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

class Analytics {
  private isEnabled: boolean = true;

  initialize(trackingId?: string) {
    if (!trackingId) {
      console.log('[Analytics] No tracking ID provided, running in debug mode');
      return;
    }
    console.log('[Analytics] Initialized with tracking ID:', trackingId);
  }

  trackPageView(path: string) {
    if (!this.isEnabled) return;
    console.log('[Analytics] Page View:', path);
    
    // Add your analytics provider here
    // Example: gtag('event', 'page_view', { page_path: path });
  }

  trackEvent({ category, action, label, value }: AnalyticsEvent) {
    if (!this.isEnabled) return;
    console.log('[Analytics] Event:', { category, action, label, value });
    
    // Add your analytics provider here
    // Example: gtag('event', action, { event_category: category, event_label: label, value });
  }

  trackSearch(query: string, resultsCount: number) {
    this.trackEvent({
      category: 'Search',
      action: 'search_query',
      label: query,
      value: resultsCount,
    });
  }

  trackContentView(contentType: 'movie' | 'tvshow' | 'episode', contentId: string, title: string) {
    this.trackEvent({
      category: 'Content',
      action: `view_${contentType}`,
      label: `${contentId}: ${title}`,
    });
  }

  trackContentInteraction(action: 'play' | 'add_to_watchlist' | 'rate' | 'review', contentId: string) {
    this.trackEvent({
      category: 'Content Interaction',
      action,
      label: contentId,
    });
  }

  trackUserAction(action: 'login' | 'logout' | 'register' | 'profile_update') {
    this.trackEvent({
      category: 'User',
      action,
    });
  }

  disable() {
    this.isEnabled = false;
    console.log('[Analytics] Disabled');
  }

  enable() {
    this.isEnabled = true;
    console.log('[Analytics] Enabled');
  }
}

export const analytics = new Analytics();
