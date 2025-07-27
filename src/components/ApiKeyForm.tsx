import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Key, ExternalLink } from "lucide-react";

export const ApiKeyForm = () => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsLoading(true);
    
    try {
      // Here you would normally save the API key to Supabase Edge Function Secrets
      // For now, we'll show a message about how to add it to Supabase
      
      toast({
        title: "API Key Setup Required",
        description: "Please add your Gemini API key to Supabase Edge Function Secrets with the name 'GEMINI_API_KEY'",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="glass-card w-96 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            Gemini API Setup
          </CardTitle>
          <CardDescription>
            Add your Gemini API key to enable AI-powered recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Gemini API Key</label>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <Input
              type={showKey ? "text" : "password"}
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="text-xs text-muted-foreground space-y-2">
            <p>
              Get your free API key from{" "}
              <Button
                variant="link"
                className="h-auto p-0 text-xs text-primary"
                onClick={() => window.open("https://makersuite.google.com/app/apikey", "_blank")}
              >
                Google AI Studio
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </p>
            <p className="text-orange-400">
              ⚠️ Add this key to Supabase Edge Function Secrets as 'GEMINI_API_KEY' for secure storage
            </p>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!apiKey.trim() || isLoading}
            className="w-full"
            variant="ai"
          >
            {isLoading ? "Setting up..." : "Save API Key"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};