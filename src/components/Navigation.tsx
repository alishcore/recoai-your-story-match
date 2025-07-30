import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Bookmark, History, Sparkles } from "lucide-react";

interface NavigationProps {
  onSectionChange?: (section: string) => void;
  currentSection?: string;
}

export const Navigation = ({ onSectionChange, currentSection = "search" }: NavigationProps) => {
  const handleSectionClick = (section: string) => {
    onSectionChange?.(section);
    
    // Smooth scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: "search", label: "Search", icon: Search },
    { id: "watchlist", label: "Watchlist", icon: Bookmark },
    { id: "history", label: "History", icon: History },
    { id: "recommendations", label: "Trending", icon: Sparkles },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="glass-card rounded-2xl p-2">
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={currentSection === item.id ? "ai" : "ghost"}
              size="sm"
              className={`px-4 py-2 transition-all duration-300 ${
                currentSection === item.id 
                  ? "shadow-lg scale-105" 
                  : "hover:bg-white/10"
              }`}
              onClick={() => handleSectionClick(item.id)}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};