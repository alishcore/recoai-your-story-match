// Gemini API Configuration
const GEMINI_API_KEY = "AIzaSyDQ68CE3uoxd4HT5y2dR4MgZgSvccJHiM8";

import { supabase } from '@/lib/supabase'

export interface Series {
  title: string;
  type: string;
  year: number;
  rating: number;
  episodes: number;
  duration: string;
  genres: string[];
  description: string;
  matchReason: string;
  confidence: number;
}

export interface RecommendationRequest {
  query: string;
  filters?: {
    genre?: string[];
    type?: string[];
    language?: string[];
  };
}

export interface RecommendationResponse {
  success: boolean;
  recommendations: Series[];
  query: string;
  totalFound: number;
  error?: string;
}

// Now using Gemini's full knowledge base instead of hardcoded series

async function callGeminiAPI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

export class AIRecommendationService {
  static async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    try {
      console.log('Getting AI recommendations for:', request.query);
      
      // Get API key from localStorage
      // Use the constant API key
      const apiKey = GEMINI_API_KEY;

      // Create a detailed prompt for Gemini to use its full knowledge
      const prompt = `
You are an expert entertainment recommendation AI with knowledge of thousands of TV series, anime, K-dramas, cartoons, and shows from around the world. A user is looking for series/shows to watch and has described what they want as: "${request.query}"

Based on this query, recommend 6-8 series/shows that match what they're looking for. Use your full knowledge of entertainment content to find the best matches.

For each recommendation, provide detailed information and return your response in this exact JSON format:
{
  "recommendations": [
    {
      "title": "Series Title",
      "type": "Anime/K-Drama/TV Series/Cartoon/etc",
      "year": 2020,
      "rating": 8.5,
      "episodes": 24,
      "duration": "45 min",
      "genres": ["Genre1", "Genre2", "Genre3"],
      "description": "Detailed description of the series",
      "matchReason": "Specific reason why this matches the user's request",
      "confidence": 85
    }
  ]
}

Important guidelines:
- Include a mix of popular and lesser-known series
- Consider anime, K-dramas, Western TV shows, cartoons, documentaries, etc.
- Give confidence scores from 70-95 based on how well each matches the query
- Be specific about why each series matches the user's criteria
- Include accurate metadata (year, episodes, rating, etc.)
- Order by confidence score (highest first)
- Focus on quality recommendations that truly match what the user described
`;

      // Call Gemini API
      const geminiResponse = await callGeminiAPI(prompt, apiKey);
      
      // Parse Gemini's response
      let analysis;
      try {
        // Extract JSON from the response (Gemini might wrap it in markdown)
        const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in Gemini response');
        }
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', geminiResponse);
        throw new Error('Failed to parse AI analysis');
      }

      // Use the recommendations directly from Gemini (no database matching needed)
      const recommendations = analysis.recommendations
        .map((rec: any) => ({
          title: rec.title,
          type: rec.type,
          year: rec.year,
          rating: rec.rating,
          episodes: rec.episodes,
          duration: rec.duration,
          genres: rec.genres || [],
          description: rec.description,
          matchReason: rec.matchReason,
          confidence: rec.confidence
        }))
        .sort((a: any, b: any) => b.confidence - a.confidence)
        .slice(0, 8); // Return top 8 recommendations

      return {
        success: true,
        recommendations,
        query: request.query,
        totalFound: recommendations.length
      };
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      throw error;
    }
  }
}