import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Play, BookmarkPlus, Clock } from "lucide-react";
import { openTrailer, openStreaming } from "@/utils/trailerUtils";
import { getCachedShowImage } from "@/utils/imageGeneration";
import { useState, useEffect } from "react";

const mockRecommendations = [
  {
    id: 1,
    title: "Steins;Gate",
    type: "Anime",
    year: 2011,
    rating: 9.0,
    episodes: 24,
    duration: "24 min",
    genres: ["Sci-Fi", "Thriller", "Drama"],
    description: "A self-proclaimed mad scientist accidentally discovers time travel through a microwave.",
    image: "/placeholder.svg",
    matchReason: "Perfect match for time travel and emotional depth themes"
  },
  {
    id: 2,
    title: "My Love from the Star",
    type: "K-Drama",
    year: 2013,
    rating: 8.2,
    episodes: 21,
    duration: "60 min",
    genres: ["Romance", "Fantasy", "Comedy"],
    description: "An alien who has been living on Earth for 400 years meets a top actress.",
    image: "/placeholder.svg",
    matchReason: "Strong female lead with supernatural romance elements"
  },
  {
    id: 3,
    title: "Avatar: The Last Airbender",
    type: "Cartoon",
    year: 2005,
    rating: 9.3,
    episodes: 61,
    duration: "23 min",
    genres: ["Adventure", "Fantasy", "Coming-of-age"],
    description: "A young boy with the power to control air discovers he's the Avatar.",
    image: "/placeholder.svg",
    matchReason: "Epic character development and world-building"
  }
];

export const RecommendationCards = () => {
  const [showImages, setShowImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = mockRecommendations.map(async (show) => {
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

    loadImages();
  }, []);
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="gradient-text">AI-Powered</span> Recommendations
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI understands context, mood, and preferences to find shows that truly match what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockRecommendations.map((show) => (
            <Card key={show.id} className="glass-card border-none overflow-hidden group">
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
                  <p className="text-xs text-primary font-medium">
                    🤖 AI Match: {show.matchReason}
                  </p>
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
                  <Button variant="glass" size="icon">
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