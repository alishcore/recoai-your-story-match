import { Hero } from "@/components/Hero";
import { RecommendationCards } from "@/components/RecommendationCards";
import { Features } from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <RecommendationCards />
      <Features />
    </div>
  );
};

export default Index;
