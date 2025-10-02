import { useQuery, useMutation } from '@tanstack/react-query';
import { Loader2, User, Mail, Calendar, Users, Heart, UserPlus, UserMinus } from 'lucide-react';
import { usersAPI } from '@/api/users';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { useParams } from 'wouter';

const UserProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { id: profileUserId } = useParams();
  
  // Determine which user profile to show (own or another user's)
  const targetUserId = profileUserId || user?._id;
  const isOwnProfile = !profileUserId || profileUserId === user?._id;

  // Fetch user profile
  const { data: userResponse, isLoading, error } = useQuery({
    queryKey: ['user', targetUserId],
    queryFn: () => usersAPI.getById(targetUserId!),
    enabled: !!targetUserId,
  });
  const userData = userResponse?.data;

  // Fetch followers
  const { data: followersResponse } = useQuery({
    queryKey: ['user-followers', user?._id],
    queryFn: () => usersAPI.getFollowers(user!._id),
    enabled: !!user,
  });
  const followers = followersResponse?.data || [];

  // Fetch following
  const { data: followingResponse } = useQuery({
    queryKey: ['user-following', user?._id],
    queryFn: () => usersAPI.getFollowing(user!._id),
    enabled: !!user,
  });
  const following = followingResponse?.data || [];

  // Check if current user is following this profile
  const isFollowing = user && userData && following.some((u: any) => u._id === userData._id);

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: () => usersAPI.follow(targetUserId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-following', user?._id] });
      queryClient.invalidateQueries({ queryKey: ['user-followers', targetUserId] });
      toast({
        title: 'Success',
        description: `You are now following ${userData?.username}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Unfollow mutation
  const unfollowMutation = useMutation({
    mutationFn: () => usersAPI.unfollow(targetUserId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-following', user?._id] });
      queryClient.invalidateQueries({ queryKey: ['user-followers', targetUserId] });
      toast({
        title: 'Success',
        description: `You unfollowed ${userData?.username}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto pt-24 pb-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to view profile</h1>
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

  if (error) return <div className="text-center py-12">Error loading profile.</div>;
  if (!userData) return <div className="text-center py-12">User profile not found.</div>;

  return (
    <div className="container mx-auto pt-24 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-card p-8 rounded-lg border mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold">{userData.username}</h1>
                {!isOwnProfile && (
                  <Button
                    onClick={handleFollowToggle}
                    disabled={followMutation.isPending || unfollowMutation.isPending}
                    variant={isFollowing ? 'outline' : 'default'}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{userData.email}</span>
                </div>
                {userData.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(userData.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{followers.length}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{following.length}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-6 rounded-lg border">
            <Heart className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Watchlist</h3>
            <p className="text-2xl font-bold">{userData.watchlistCount || 0}</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <Users className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Reviews</h3>
            <p className="text-2xl font-bold">{userData.reviewsCount || 0}</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <User className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Ratings</h3>
            <p className="text-2xl font-bold">{userData.ratingsCount || 0}</p>
          </div>
        </div>

        {/* Followers Section */}
        {followers.length > 0 && (
          <div className="bg-card p-6 rounded-lg border mb-4">
            <h2 className="text-xl font-bold mb-4">Followers ({followers.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {followers.slice(0, 8).map((follower: any) => (
                <div key={follower._id} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-2 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium">{follower.username}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Following Section */}
        {following.length > 0 && (
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Following ({following.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {following.slice(0, 8).map((followedUser: any) => (
                <div key={followedUser._id} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-2 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium">{followedUser.username}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
