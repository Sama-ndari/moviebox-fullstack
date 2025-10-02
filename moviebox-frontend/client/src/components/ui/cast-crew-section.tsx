import { User } from 'lucide-react';
import { useLocation } from 'wouter';

interface CastCrewSectionProps {
  cast?: any[];
  crew?: any[];
}

export function CastCrewSection({ cast, crew }: CastCrewSectionProps) {
  const [, navigate] = useLocation();

  if (!cast?.length && !crew?.length) return null;

  return (
    <div className="mt-12">
      {/* Cast Section */}
      {cast && cast.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cast.slice(0, 12).map((person: any, index: number) => (
              <div
                key={person._id || index}
                className="cursor-pointer group"
                onClick={() => person._id && navigate(`/person/${person._id}`)}
              >
                <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden mb-2">
                  {person.profileUrl || person.profilePath ? (
                    <img
                      src={person.profileUrl || person.profilePath}
                      alt={person.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="text-sm">
                  <p className="font-semibold truncate">{person.name}</p>
                  {person.character && (
                    <p className="text-muted-foreground truncate text-xs">
                      {person.character}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crew Section */}
      {crew && crew.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Crew</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {crew.slice(0, 6).map((person: any, index: number) => (
              <div
                key={person._id || index}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                onClick={() => person._id && navigate(`/person/${person._id}`)}
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  {person.profileUrl || person.profilePath ? (
                    <img
                      src={person.profileUrl || person.profilePath}
                      alt={person.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{person.name}</p>
                  {person.job && (
                    <p className="text-sm text-muted-foreground truncate">
                      {person.job}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
