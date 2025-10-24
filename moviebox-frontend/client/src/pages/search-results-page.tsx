import React from "react";
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { ContentCardProps, MediaType } from '@/types';
import SearchForm from '@/components/ui/search-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchAPI } from '@/api/search';

const SearchResultsPage = () => {
  const [, navigate] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get('q') || '';
  
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  
  // Fetch search results
  const { 
    data: searchResponse, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['search', queryParam],
    queryFn: () => searchAPI.search(queryParam),
    enabled: queryParam.length > 0,
  });
  const searchData = searchResponse?.data;
  
  // Handle search form submission
  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  
  // Convert search results to ContentCardProps
  const processedResults: ContentCardProps[] = React.useMemo(() => {
    if (!searchData) return [];

    const movies = searchData.movies?.map((item: any) => ({ ...item, mediaType: 'movie' })) || [];
    const tvShows = searchData.tvShows?.map((item: any) => ({ ...item, mediaType: 'tvshow' })) || [];
    const people = searchData.people?.map((item: any) => ({ ...item, mediaType: 'person' })) || [];

    return [...movies, ...tvShows, ...people].map((item: any) => ({
      id: item._id ?? item.id,
      title: item.title || item.name,
      posterPath: item.posterUrl ?? item.posterPath ?? item.profilePath,
      backdropPath: item.backdropUrl,
      releaseYear: item.releaseDate ? new Date(item.releaseDate).getFullYear() : (item.firstAirDate ? new Date(item.firstAirDate).getFullYear() : undefined),
      voteAverage: item.averageRating ?? item.voteAverage ?? '',
      mediaType: item.mediaType as MediaType,
      description: item.description || item.biography,
      genres: item.genres,
      status: item.status,
      trailerUrl: item.trailerUrl,
      contentRating: item.contentRating,
      ratingCount: item.ratingCount,
      seasons: item.seasons,
      totalEpisodes: item.totalEpisodes,
      cast: item.cast,
      crew: item.crew,
      isFeatured: item.isFeatured,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      popularity: item.popularity,
    }));
  }, [searchData]);
  
  // Calculate counts
  const movieCount = processedResults.filter(r => r.mediaType === 'movie').length;
  const tvShowCount = processedResults.filter(r => r.mediaType === 'tvshow').length;
  const personCount = processedResults.filter(r => r.mediaType === 'person').length;
  
  // Filter by active tab
  const filteredResults = React.useMemo(() => {
    if (activeTab === 'all') return processedResults;
    return processedResults.filter(r => r.mediaType === activeTab);
  }, [processedResults, activeTab]);
  
  // Sort results
  const sortedResults = React.useMemo(() => {
    const results = [...filteredResults];
    
    switch (sortBy) {
      case 'recent':
        return results.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
      case 'rating':
        return results.sort((a, b) => {
          const ratingA = typeof a.voteAverage === 'number' ? a.voteAverage : 0;
          const ratingB = typeof b.voteAverage === 'number' ? b.voteAverage : 0;
          return ratingB - ratingA;
        });
      case 'title':
        return results.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return results;
    }
  }, [filteredResults, sortBy]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    console.error('SEARCH PAGE ERROR:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-bold mb-2">Error loading search results</h2>
        <p className="text-muted-foreground mb-4">{error?.message || 'An unexpected error occurred.'}</p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} initialQuery={queryParam} />
        </div>
        
        {/* Results Summary */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Search Results for "{queryParam}"
          </h1>
          <p className="text-muted-foreground">
            {processedResults.length} results found ({movieCount} movies, {tvShowCount} TV shows)
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({processedResults.length})</TabsTrigger>
              <TabsTrigger value="movie">Movies ({movieCount})</TabsTrigger>
              <TabsTrigger value="tvshow">TV Shows ({tvShowCount})</TabsTrigger>
              <TabsTrigger value="person">People ({personCount})</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="title">A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Results Grid */}
        {sortedResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {sortedResults.map((item) => (
              <div 
                key={`${item.mediaType}-${item.id}`} 
                className="movie-card transition-transform duration-300 ease-out cursor-pointer"
                onClick={() => navigate(`/${item.mediaType}/${item.id}`)}
              >
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={item.posterPath}
                    alt={item.title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 h-24 card-overlay px-3 py-3 flex flex-col justify-end">
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-xs mr-1">★</span>
                        <span className="text-xs">{item.voteAverage}</span>
                      </div>
                      <span className="mx-2 text-xs text-white/50">•</span>
                      <span className="text-xs text-white/50">{item.releaseYear}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl mb-2">No results found</p>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
