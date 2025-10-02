import { useLocation } from "wouter";
import { ContentCardProps } from "@/types";

const MovieCard = ({
  id,
  title,
  posterPath,
  releaseYear,
  voteAverage,
  mediaType,
}: ContentCardProps) => {
  const [, navigate] = useLocation();

  const handleClick = () => {
    navigate(`/${mediaType}/${id}`);
  };

  return (
    <div
      className="movie-card flex-shrink-0 w-full rounded-lg overflow-hidden transition-transform duration-300 ease-out cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={posterPath || 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={title}
          className="w-full aspect-[2/3] object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image';
          }}
        />
        <div className="absolute bottom-0 inset-x-0 h-24 card-overlay px-3 py-3 flex flex-col justify-end">
          <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
          <div className="flex items-center mt-1">
            <div className="flex items-center">
              <span className="text-yellow-500 text-xs mr-1">★</span>
              <span className="text-xs">{voteAverage}</span>
            </div>
            <span className="mx-2 text-xs text-foreground/50">•</span>
            <span className="text-xs text-foreground/50">{releaseYear}</span>
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-foreground/10 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
