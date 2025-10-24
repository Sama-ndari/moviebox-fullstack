import { useQuery, useMutation } from '@tanstack/react-query';
import { Loader2, Trash2, TrendingUp } from 'lucide-react';
import { watchHistoryAPI } from '@/api/watchhistory';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

const WatchHistoryPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch watch history
  const { data: historyResponse, isLoading, error } = useQuery({
    queryKey: ['watchhistory', user?._id],
    queryFn: () => watchHistoryAPI.getHistory(user!._id),
    enabled: !!user,
  });
  const history = historyResponse?.data?.items || [];

  // Fetch analytics
  const { data: analyticsResponse } = useQuery({
    queryKey: ['watchhistory-analytics', user?._id],
    queryFn: () => watchHistoryAPI.getAnalytics(user!._id),
    enabled: !!user,
  });
  const analytics = analyticsResponse?.data;

  // Delete history mutation
  const deleteMutation = useMutation({
    mutationFn: ({ historyId }: { historyId: string }) =>
      watchHistoryAPI.delete(user!._id, historyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchhistory', user?._id] });
      toast({ title: 'Removed from history' });
    },
  });

  if (!user) {
    return (
      <div className="container mx-auto pt-24 pb-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to view watch history</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) return <div className="text-center py-12">Error loading watch history.</div>;

  return (
    <div className="container mx-auto pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-8">Watch History</h1>

      {/* Analytics Section */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Total Watched</h3>
            </div>
            <p className="text-3xl font-bold">{analytics.totalWatched || 0}</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Total Time</h3>
            <p className="text-3xl font-bold">{analytics.totalWatchTime || 0}h</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">This Month</h3>
            <p className="text-3xl font-bold">{analytics.thisMonth || 0}</p>
          </div>
        </div>
      )}

      {/* History List */}
      {history.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No watch history found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item: any) => (
            <div
              key={item._id}
              className="bg-card p-4 rounded-lg border flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {item.content?.posterUrl && (
                  <img
                    src={item.content.posterUrl}
                    alt={item.content.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{item.content?.title || 'Unknown'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.contentType} • Watched: {new Date(item.watchedAt).toLocaleDateString()}
                  </p>
                  {item.progress && (
                    <div className="mt-2 w-48 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMutation.mutate({ historyId: item._id })}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistoryPage;
