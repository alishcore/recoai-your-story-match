import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/SearchInput";
import { AuthButton } from "@/components/AuthButton";
import { type Series } from "@/services/aiRecommendations";

interface HeroProps {
  onSearchResults?: (results: Series[], query: string) => void;
}

export const Hero = ({ onSearchResults }: HeroProps) => {
  const handleSearchResults = (results: Series[], query: string) => {
    onSearchResults?.(results, query);
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Auth Button */}
        <div className="absolute top-6 right-6 z-20">
          <AuthButton />
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl floating"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl floating" style={{ animationDelay: '-3s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Brand */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold">
              <span className="gradient-text">Reco</span>
              <span className="gradient-accent-text">AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Discover your next binge-watch with AI-powered recommendations that understand exactly what you're craving
            </p>
          </div>

          {/* Search Section */}
          <div className="space-y-6">
            <SearchInput onResults={handleSearchResults} />
            
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="glass" size="sm">
                🎭 K-Drama
              </Button>
              <Button variant="glass" size="sm">
                🗾 Anime
              </Button>
              <Button variant="glass" size="sm">
                🎨 Cartoons
              </Button>
              <Button variant="glass" size="sm">
                📺 Series
              </Button>
            </div>
          </div>

          {/* Example Queries */}
          <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-center">Try these examples:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                "I want something with time travel, emotional depth, and a strong female lead"
              </div>
              <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                "Dark fantasy anime with complex plot twists and anti-hero protagonists"
              </div>
              <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                "Light-hearted Korean romance with workplace setting and comedy"
              </div>
              <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                "Coming-of-age story with friendship themes and stunning animation"
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};