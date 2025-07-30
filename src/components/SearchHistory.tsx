import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Search, X, Clock } from "lucide-react";

interface SearchHistoryItem {
  query: string;
  timestamp: Date;
  resultCount: number;
}

export const SearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load search history from localStorage
    const savedHistory = localStorage.getItem("recoai_search_history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (error) {
        console.error("Failed to parse search history:", error);
      }
    }
  }, []);

  const saveToHistory = (query: string, resultCount: number) => {
    const newItem: SearchHistoryItem = {
      query,
      timestamp: new Date(),
      resultCount
    };

    const updatedHistory = [newItem, ...history.filter(item => item.query !== query)].slice(0, 10);
    setHistory(updatedHistory);
    
    localStorage.setItem("recoai_search_history", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("recoai_search_history");
  };

  const removeHistoryItem = (query: string) => {
    const updatedHistory = history.filter(item => item.query !== query);
    setHistory(updatedHistory);
    localStorage.setItem("recoai_search_history", JSON.stringify(updatedHistory));
  };

  // Expose the saveToHistory function globally so other components can use it
  useEffect(() => {
    (window as any).saveSearchToHistory = saveToHistory;
  }, [history]);

  if (history.length === 0) {
    return null;
  }

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card border-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Recent Searches
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(!isVisible)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isVisible ? "Hide" : "Show"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </CardHeader>

          {isVisible && (
            <CardContent>
              <div className="space-y-3">
                {history.map((item, index) => (
                  <div 
                    key={`${item.query}-${index}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.query}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {item.timestamp.toLocaleDateString()}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {item.resultCount} results
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeHistoryItem(item.query)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </section>
  );
};