import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Key, ExternalLink } from "lucide-react";

export const ApiKeyForm = () => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isStored, setIsStored] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setIsStored(true);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('gemini_api_key', apiKey.trim());
    setIsStored(true);
    toast({
      title: "Success",
      description: "API key saved! You can now use AI recommendations.",
    });
  };

  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setIsStored(false);
    toast({
      title: "Cleared",
      description: "API key removed from storage",
    });
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
            {isStored && (
              <p className="text-green-400">
                ✅ API key is stored and ready to use
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex-1"
            >
              {isStored ? 'Update' : 'Save'} Key
            </Button>
            {isStored && (
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};