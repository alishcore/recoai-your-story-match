import { Card, CardContent } from "@/components/ui/card";
import { Brain, MessageSquare, Filter, Bookmark, Users, Globe } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Natural Language AI",
    description: "Describe what you want in your own words - our AI understands context, mood, and preferences"
  },
  {
    icon: MessageSquare,
    title: "Smart Matching",
    description: "Advanced NLP algorithms match your descriptions with thousands of series across all genres"
  },
  {
    icon: Filter,
    title: "Intelligent Filters",
    description: "Optional filters for genre, mood, language, episode count, and viewing time"
  },
  {
    icon: Bookmark,
    title: "Personal Watchlist",
    description: "Save recommendations and track your viewing history with smart organization"
  },
  {
    icon: Users,
    title: "Community Reviews",
    description: "See what others thought about recommended titles and share your own insights"
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Works in multiple languages - get recommendations for global content"
  }
];

export const Features = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Why <span className="gradient-text">RecoAI</span> is Different
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Traditional recommendation systems rely on ratings and viewing history. 
            We use advanced AI to understand what you actually want to watch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card border-none group hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8 space-y-4 text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};