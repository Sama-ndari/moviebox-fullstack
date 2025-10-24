import GenreCard from "@/components/ui/genre-card";
import { Genre } from "@/lib/types";

interface GenreSectionProps {
  genres: Genre[];
}

export default function GenreSection({ genres }: GenreSectionProps) {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-xl md:text-2xl">Browse by Genre</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {genres.map((genre) => (
            <GenreCard 
              key={genre.id}
              genre={genre}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
