import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ChevronRight, Play, SkipForward, SkipBack, Star, Calendar, Clock } from 'lucide-react';
import { episodesAPI } from '@/api/episodes';
import { seasonsAPI } from '@/api/seasons';
import { ContentCardProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const EpisodeDetailsPage = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  
  const { data: episodeResponse, isLoading, error } = useQuery({
    queryKey: ['episode', id],
    queryFn: () => episodesAPI.getById(id!),
    enabled: !!id,
  });
  const data = episodeResponse?.data;

  // Fetch season data to get episode list for next/prev navigation
  const { data: seasonResponse } = useQuery({
    queryKey: ['season', data?.season],
    queryFn: () => seasonsAPI.getById(data!.season as string),
    enabled: !!data?.season,
  });
  const seasonData = seasonResponse?.data;

  // Get all episodes in this season
  const { data: episodesResponse } = useQuery({
    queryKey: ['season-episodes', data?.season],
    queryFn: () => seasonsAPI.getEpisodes(data!.season as string),
    enabled: !!data?.season,
  });
  const allEpisodes = Array.isArray(episodesResponse?.data) ? episodesResponse.data : [];

  // Find next and previous episodes
  const currentIndex = allEpisodes.findIndex((ep: any) => ep._id === id);
  const nextEpisode = currentIndex >= 0 && currentIndex < allEpisodes.length - 1 ? allEpisodes[currentIndex + 1] : null;
  const prevEpisode = currentIndex > 0 ? allEpisodes[currentIndex - 1] : null;

  // Fetch recommended content using backend recommendations endpoint
  const {
    data: recommendedResponse,
    isLoading: isLoadingRecommended
  } = useQuery({
    queryKey: ['episode-recommendations', id],
    queryFn: () => episodesAPI.getRecommendations(id!, 6),
    enabled: !!id,
  });
  const recommendedContent = recommendedResponse?.data || [];

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  if (error) return <div className="text-center py-12">Error loading episode.</div>;
  if (!data) return <div className="text-center py-12">Episode not found.</div>;
  const details = {
    id: data._id ?? data.id,
    episodeNumber: data.episodeNumber,
    title: data.title,
    description: data.description,
    duration: data.duration,
    releaseDate: data.releaseDate,
    averageRating: data.averageRating,
    ratingCount: data.ratingCount,
    popularity: data.popularity,
    thumbnailUrl: data.thumbnailUrl,
    season: data.season,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };

  return (
    <div className="container mx-auto pt-24 pb-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/')}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="w-4 h-4" />
          </BreadcrumbSeparator>
          {seasonData && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate(`/season/${seasonData._id}`)}>
                  Season {seasonData.seasonNumber}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage>Episode {details.episodeNumber}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Episode Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {details.thumbnailUrl && (
          <div className="w-full md:w-96 flex-shrink-0">
            <img 
              src={details.thumbnailUrl} 
              alt={`Episode ${details.episodeNumber}`} 
              className="w-full rounded-lg shadow-lg aspect-video object-cover" 
            />
            
            {/* Watch Button */}
            <Button className="w-full mt-4" size="lg">
              <Play className="w-5 h-5 mr-2" />
              Watch Episode
            </Button>
          </div>
        )}
        
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">
            {details.episodeNumber}. {details.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {details.releaseDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date(details.releaseDate).toLocaleDateString()}</span>
              </div>
            )}
            
            {details.duration && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{details.duration}m</span>
              </div>
            )}
            
            {details.averageRating && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="font-semibold">{details.averageRating}</span>
                <span className="text-muted-foreground">({details.ratingCount} ratings)</span>
              </div>
            )}
          </div>
          
          {details.description && (
            <p className="text-muted-foreground mb-6 text-lg">{details.description}</p>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {prevEpisode && (
              <Button 
                variant="outline" 
                onClick={() => navigate(`/episode/${prevEpisode._id}`)}
              >
                <SkipBack className="w-4 h-4 mr-2" />
                Previous Episode
              </Button>
            )}
            
            {nextEpisode && (
              <Button 
                onClick={() => navigate(`/episode/${nextEpisode._id}`)}
              >
                Next Episode
                <SkipForward className="w-4 h-4 ml-2" />
              </Button>
            )}
            
            {seasonData && (
              <Button 
                variant="secondary"
                onClick={() => navigate(`/season/${seasonData._id}`)}
                className="ml-auto"
              >
                View All Episodes
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeDetailsPage;
