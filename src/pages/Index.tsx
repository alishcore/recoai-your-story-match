import { useState } from "react";
import { Hero } from "@/components/Hero";
import { RecommendationCards } from "@/components/RecommendationCards";
import { Features } from "@/components/Features";

import { SearchResults } from "@/components/SearchResults";
import { SearchHistory } from "@/components/SearchHistory";
import { Watchlist } from "@/components/Watchlist";
import { Navigation } from "@/components/Navigation";
import { type Series } from "@/services/aiRecommendations";

const Index = () => {
  const [searchResults, setSearchResults] = useState<Series[]>([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentSection, setCurrentSection] = useState("search");

  const handleSearchResults = (results: Series[], query: string) => {
    setSearchResults(results);
    setCurrentQuery(query);
  };

  return (
    <div className="min-h-screen">
      <div id="search">
        <Hero onSearchResults={handleSearchResults} />
        
        {searchResults.length > 0 && (
          <SearchResults results={searchResults} query={currentQuery} />
        )}
      </div>
      
      <div id="watchlist">
        <Watchlist />
      </div>
      
      <div id="history">
        <SearchHistory />
      </div>
      
      <div id="recommendations">
        <RecommendationCards />
      </div>
      
      <Features />
      
      <Navigation 
        currentSection={currentSection} 
        onSectionChange={setCurrentSection} 
      />
    </div>
  );
};

export default Index;
