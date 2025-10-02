import { useLocation } from "wouter";
import { GenreCardProps } from "@/types";

const GenreCard = ({ id, name, imageUrl }: GenreCardProps) => {
  const [, navigate] = useLocation();

  const handleClick = () => {
    navigate(`/content/genre/${name}`);
  };

  return (
    <div 
      className="genre-card rounded-lg overflow-hidden relative cursor-pointer transition-transform duration-300 hover:scale-105"
      onClick={handleClick}
    >
      <img 
        src={imageUrl} 
        alt={`${name} genre`} 
        className="w-full h-24 sm:h-32 object-cover" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/30 flex items-center justify-center">
        <span className="text-white font-medium text-sm sm:text-base">{name}</span>
      </div>
    </div>
  );
};

export default GenreCard;
