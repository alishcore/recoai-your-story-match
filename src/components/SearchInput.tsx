import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";

export const SearchInput = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    
    // TODO: Implement actual AI search
    console.log("Searching for:", query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
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
                  <span>Finding...</span>
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
            AI is analyzing your preferences...
          </div>
        </div>
      )}
    </div>
  );
};