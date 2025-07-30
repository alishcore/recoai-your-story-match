import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkPlus, BookmarkCheck, Star, Clock, Trash2 } from "lucide-react";
import { type Series } from "@/services/aiRecommendations";
import { useToast } from "@/hooks/use-toast";

export const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<Series[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem("recoai_watchlist");
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (error) {
        console.error("Failed to parse watchlist:", error);
      }
    }
  }, []);

  const addToWatchlist = (series: Series) => {
    const isAlreadyInWatchlist = watchlist.some(item => item.title === series.title);
    
    if (isAlreadyInWatchlist) {
      toast({
        title: "Already in Watchlist",
        description: `${series.title} is already in your watchlist`,
        variant: "destructive"
      });
      return;
    }

    const updatedWatchlist = [...watchlist, series];
    setWatchlist(updatedWatchlist);
    localStorage.setItem("recoai_watchlist", JSON.stringify(updatedWatchlist));
    
    toast({
      title: "Added to Watchlist",
      description: `${series.title} has been added to your watchlist`,
    });
  };

  const removeFromWatchlist = (title: string) => {
    const updatedWatchlist = watchlist.filter(item => item.title !== title);
    setWatchlist(updatedWatchlist);
    localStorage.setItem("recoai_watchlist", JSON.stringify(updatedWatchlist));
    
    toast({
      title: "Removed from Watchlist",
      description: "Series has been removed from your watchlist",
    });
  };

  const isInWatchlist = (title: string) => {
    return watchlist.some(item => item.title === title);
  };

  // Expose functions globally so other components can use them
  useEffect(() => {
    (window as any).addToWatchlist = addToWatchlist;
    (window as any).removeFromWatchlist = removeFromWatchlist;
    (window as any).isInWatchlist = isInWatchlist;
  }, [watchlist]);

  if (watchlist.length === 0) {
    return (
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card border-none text-center">
            <CardContent className="py-12">
              <BookmarkPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your Watchlist is Empty</h3>
              <p className="text-muted-foreground">
                Start searching for shows and add them to your watchlist to keep track of what you want to watch!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Your Watchlist</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {watchlist.length} series saved for later
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map((show, index) => (
            <Card key={`${show.title}-${index}`} className="glass-card border-none overflow-hidden group">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <BookmarkCheck className="w-12 h-12 text-white/70" />
                </div>
                <Badge className="absolute top-3 left-3 bg-black/80 text-white">
                  {show.type}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-black/80 hover:bg-red-500/80 text-white"
                  onClick={() => removeFromWatchlist(show.title)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};