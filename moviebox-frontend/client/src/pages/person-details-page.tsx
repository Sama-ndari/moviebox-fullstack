import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { personAPI } from '@/api/person';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

const PersonDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: personResponse, isLoading, error } = useQuery({
    queryKey: ['person', id],
    queryFn: () => personAPI.getById(id!),
    enabled: !!id,
  });
  const data = personResponse?.data;

  // Get person's movies
  const { data: moviesResponse } = useQuery({
    queryKey: ['person-movies', id],
    queryFn: () => personAPI.getMovies(id!),
    enabled: !!id,
  });

  // Get person's TV shows
  const { data: tvShowsResponse } = useQuery({
    queryKey: ['person-tvshows', id],
    queryFn: () => personAPI.getTVShows(id!),
    enabled: !!id,
  });

  const handleFollow = async () => {
    if (!user || !id) return;
    try {
      if (isFollowing) {
        await personAPI.unfollow(id);
        setIsFollowing(false);
      } else {
        await personAPI.follow(id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Follow error:', error);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading person...</div>;
  if (error) return <div className="text-center py-12">Error loading person.</div>;
  if (!data) return <div className="text-center py-12">Person not found.</div>;

  // Map all backend fields for details display
  const details = {
    id: data._id ?? data.id,
    name: data.name,
    biography: data.biography,
    birthDate: data.birthDate,
    deathDate: data.deathDate,
    birthPlace: data.birthPlace,
    nationality: data.nationality,
    profilePath: data.profilePath,
    isActive: data.isActive,
    roles: Array.isArray(data.roles) ? data.roles : [],
    socialMedia: data.socialMedia,
    filmography: Array.isArray(data.filmography) ? data.filmography : [],
    awards: Array.isArray(data.awards) ? data.awards : [],
    height: data.height,
    knownFor: Array.isArray(data.knownFor) ? data.knownFor : [],
    popularity: data.popularity,
    relatedPeople: Array.isArray(data.relatedPeople) ? data.relatedPeople : [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };

  return (
    <div className="container mx-auto pt-24 pb-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {details.profilePath && <img src={details.profilePath} alt={details.name} className="w-48 rounded shadow mb-4 md:mb-0" />}
        <div>
          <h1 className="text-3xl font-bold mb-2">{details.name}</h1>
          {details.roles.length > 0 && <div className="mb-2 text-sm">Roles: {details.roles.join(', ')}</div>}
          {details.birthDate && <div className="mb-2 text-sm">Birth Date: {new Date(details.birthDate).toLocaleDateString()}</div>}
          {details.deathDate && <div className="mb-2 text-sm">Death Date: {new Date(details.deathDate).toLocaleDateString()}</div>}
          {details.birthPlace && <div className="mb-2 text-sm">Birth Place: {details.birthPlace}</div>}
          {details.nationality && <div className="mb-2 text-sm">Nationality: {details.nationality}</div>}
          {details.height && <div className="mb-2 text-sm">Height: {details.height} cm</div>}
          {details.popularity !== undefined && <div className="mb-2 text-sm">Popularity: {details.popularity}</div>}
          {details.knownFor.length > 0 && <div className="mb-2 text-sm">Known For: {details.knownFor.join(', ')}</div>}
          {details.biography && <div className="mb-4 text-base">{details.biography}</div>}
          {details.socialMedia && (
            <div className="mb-2 text-sm">
              Social Media:
              <ul className="list-disc ml-6">
                {details.socialMedia.instagram && <li>Instagram: <a href={details.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{details.socialMedia.instagram}</a></li>}
                {details.socialMedia.twitter && <li>Twitter: <a href={details.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{details.socialMedia.twitter}</a></li>}
                {details.socialMedia.facebook && <li>Facebook: <a href={details.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{details.socialMedia.facebook}</a></li>}
                {details.socialMedia.website && <li>Website: <a href={details.socialMedia.website} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{details.socialMedia.website}</a></li>}
              </ul>
            </div>
          )}
          {details.awards.length > 0 && (
            <div className="mb-2 text-sm">
              Awards:
              <ul className="list-disc ml-6">
                {details.awards.map((award: any, idx: number) => (
                  <li key={idx}>{award.name} ({award.year}){award.category ? ` - ${award.category}` : ''}</li>
                ))}
              </ul>
            </div>
          )}
          {details.filmography.length > 0 && (
            <div className="mb-2 text-sm">Filmography: {details.filmography.length} credits</div>
          )}
          {details.relatedPeople.length > 0 && (
            <div className="mb-2 text-sm">Related People: {details.relatedPeople.length}</div>
          )}
          {details.createdAt && <div className="mb-2 text-xs text-muted-foreground">Created: {new Date(details.createdAt).toLocaleDateString()}</div>}
          {details.updatedAt && <div className="mb-2 text-xs text-muted-foreground">Updated: {new Date(details.updatedAt).toLocaleDateString()}</div>}
        </div>
      </div>
    </div>
  );
};

export default PersonDetailsPage;
