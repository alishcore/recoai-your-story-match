import { Hero } from "@/components/Hero";
import { RecommendationCards } from "@/components/RecommendationCards";
import { Features } from "@/components/Features";
import { ApiKeyForm } from "@/components/ApiKeyForm";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <RecommendationCards />
      <Features />
      <ApiKeyForm />
    </div>
  );
};

export default Index;
