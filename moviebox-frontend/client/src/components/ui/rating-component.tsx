import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface RatingComponentProps {
  currentRating?: number;
  onRate: (rating: number) => Promise<void>;
  isAuthenticated: boolean;
}

export const RatingComponent = ({ currentRating, onRate, isAuthenticated }: RatingComponentProps) => {
  const [rating, setRating] = useState(currentRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleRate = async (value: number) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please login to rate',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onRate(value);
      setRating(value);
      toast({
        title: 'Rating submitted',
        description: `You rated this ${value}/10`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit rating',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
          <button
            key={value}
            onClick={() => handleRate(value)}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(0)}
            disabled={isSubmitting}
            className="p-1 transition-transform hover:scale-110 disabled:opacity-50"
          >
            <Star
              className={`w-5 h-5 ${
                value <= (hoveredRating || rating)
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'text-gray-400'
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {rating > 0 ? `${rating}/10` : 'Rate this'}
      </span>
    </div>
  );
};
