import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Play, BookmarkPlus, Clock, Brain } from "lucide-react";
import { type Series } from "@/services/aiRecommendations";
import { openTrailer, openStreaming } from "@/utils/trailerUtils";
import { getCachedShowImage } from "@/utils/imageGeneration";
import { useState, useEffect } from "react";

interface SearchResultsProps {
  results: Series[];
  query: string;
}

export const SearchResults = ({ results, query }: SearchResultsProps) => {
  const [showImages, setShowImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = results.map(async (show) => {
        const imageUrl = await getCachedShowImage({
          title: show.title,
          type: show.type,
          genres: show.genres,
          description: show.description
        });
        return { key: `${show.title}-${show.type}`, url: imageUrl };
      });

      const images = await Promise.all(imagePromises);
      const imageMap = images.reduce((acc, { key, url }) => {
        acc[key] = url;
        return acc;
      }, {} as Record<string, string>);

      setShowImages(imageMap);
    };

    if (results.length > 0) {
      loadImages();
    }
  }, [results]);

  if (results.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            <span className="gradient-text">AI Recommendations</span> for "{query}"
          </h2>
          <p className="text-lg text-muted-foreground">
            Found {results.length} perfect matches using Gemini AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((show, index) => (
            <Card key={`${show.title}-${index}`} className="glass-card border-none overflow-hidden group">
              <div className="relative">
                {showImages[`${show.title}-${show.type}`] ? (
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={showImages[`${show.title}-${show.type}`]} 
                      alt={`${show.title} poster`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white/70" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button 
                    variant="ai" 
                    size="sm"
                    onClick={() => openTrailer(show.title, show.year)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Trailer
                  </Button>
                </div>
                <Badge className="absolute top-3 left-3 bg-black/80 text-white">
                  {show.type}
                </Badge>
                <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-accent text-white px-2 py-1 rounded-lg text-xs font-bold">
                  {Math.round(show.confidence)}% Match
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold leading-tight">{show.title}</h3>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{show.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{show.year}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {show.episodes} eps • {show.duration}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {show.genres.map((genre) => (
                    <Badge key={genre} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {show.description}
                </p>

                <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                  <div className="flex items-start gap-2">
                    <Brain className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-primary font-medium">
                      <strong>AI Analysis:</strong> {show.matchReason}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="ai" 
                    className="flex-1"
                    onClick={() => openStreaming(show.title, show.year)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Now
                  </Button>
                  <Button 
                    variant="glass" 
                    size="icon"
                    onClick={() => {
                      if ((window as any).addToWatchlist) {
                        (window as any).addToWatchlist(show);
                      }
                    }}
                  >
                    <BookmarkPlus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};