import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Loader2, Star, ThumbsUp, Edit, Trash2 } from 'lucide-react';
import { reviewsAPI } from '@/api/reviews';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

const ReviewsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'my-reviews'>('all');

  // Fetch all reviews
  const { data: reviewsResponse, isLoading, error } = useQuery({
    queryKey: ['reviews', 'all'],
    queryFn: () => reviewsAPI.getAll(),
    enabled: filter === 'all',
  });
  const allReviews = reviewsResponse?.data || [];

  // Fetch user's reviews
  const { data: userReviewsResponse, isLoading: isLoadingUserReviews } = useQuery({
    queryKey: ['reviews', 'user', user?._id],
    queryFn: () => reviewsAPI.getByUser(user!._id),
    enabled: !!user && filter === 'my-reviews',
  });
  const userReviews = userReviewsResponse?.data || [];

  const reviews = filter === 'all' ? allReviews : userReviews;

  // Delete review mutation
  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => reviewsAPI.delete(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({ title: 'Review deleted' });
    },
  });

  if (isLoading || isLoadingUserReviews) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) return <div className="text-center py-12">Error loading reviews.</div>;

  return (
    <div className="container mx-auto pt-24 pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Reviews</h1>
        {user && (
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Reviews
            </Button>
            <Button
              variant={filter === 'my-reviews' ? 'default' : 'outline'}
              onClick={() => setFilter('my-reviews')}
            >
              My Reviews
            </Button>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No reviews found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review: any) => (
            <div key={review._id} className="bg-card p-6 rounded-lg border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{review.content?.title || 'Unknown'}</h3>
                  <p className="text-sm text-muted-foreground">
                    by {review.user?.username || 'Anonymous'} • {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    <span className="font-bold">{review.rating}/10</span>
                  </div>
                  {user && user._id === review.user?._id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(review._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{review.content?.type || review.targetType}</p>
              <p className="mb-4">{review.reviewText}</p>
              {review.helpfulCount > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.helpfulCount} people found this helpful</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
