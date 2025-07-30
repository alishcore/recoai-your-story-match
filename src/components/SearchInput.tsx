import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import { AIRecommendationService, type Series } from "@/services/aiRecommendations";
import { useToast } from "@/hooks/use-toast";

interface SearchInputProps {
  onResults?: (results: Series[], query: string) => void;
}

export const SearchInput = ({ onResults }: SearchInputProps) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await AIRecommendationService.getRecommendations({
        query: query.trim()
      });

      if (response.success && response.recommendations.length > 0) {
        toast({
          title: "Recommendations Found!",
          description: `Found ${response.recommendations.length} matches for "${query}"`,
        });
        onResults?.(response.recommendations, query.trim());
        
        // Save to search history
        if ((window as any).saveSearchToHistory) {
          (window as any).saveSearchToHistory(query.trim(), response.recommendations.length);
        }
      } else {
        toast({
          title: "No matches found",
          description: "Try describing what you want differently or use broader terms",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to get recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
        
        <div className="relative glass-card rounded-2xl p-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Describe what you want to watch... (e.g., 'romantic comedy with time travel')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-4 py-4 text-lg bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground/70"
              />
            </div>
            
            <Button
              onClick={handleSearch}
              disabled={!query.trim() || isLoading}
              variant="ai"
              size="lg"
              className="px-6 py-4 shrink-0"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>AI Thinking...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Find Shows</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {isLoading && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Gemini AI is analyzing your preferences...
          </div>
        </div>
      )}

      {/* Quick Example Buttons */}
      <div className="flex flex-wrap justify-center gap-2 text-xs">
        {[
          "time travel with emotional depth",
          "dark fantasy with complex characters", 
          "romantic comedy workplace setting",
          "coming-of-age with stunning animation"
        ].map((example) => (
          <button
            key={example}
            onClick={() => handleExampleClick(example)}
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            "{example}"
          </button>
        ))}
      </div>
    </div>
  );
};