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

// Curated database of series with rich metadata
const seriesDatabase: Series[] = [
  {
    title: "Steins;Gate",
    type: "Anime",
    year: 2011,
    rating: 9.0,
    episodes: 24,
    duration: "24 min",
    genres: ["Sci-Fi", "Thriller", "Drama", "Time Travel"],
    description: "A self-proclaimed mad scientist accidentally discovers time travel through a microwave, leading to consequences that threaten the fabric of reality.",
    matchReason: "",
    confidence: 0
  },
  {
    title: "My Love from the Star",
    type: "K-Drama",
    year: 2013,
    rating: 8.2,
    episodes: 21,
    duration: "60 min",
    genres: ["Romance", "Fantasy", "Comedy", "Strong Female Lead"],
    description: "An alien who has been living on Earth for 400 years meets a top actress, leading to an otherworldly romance.",
    matchReason: "",
    confidence: 0
  },
  {
    title: "Avatar: The Last Airbender",
    type: "Cartoon",
    year: 2005,
    rating: 9.3,
    episodes: 61,
    duration: "23 min",
    genres: ["Adventure", "Fantasy", "Coming-of-age", "Strong Characters"],
    description: "A young boy with the power to control air discovers he's the Avatar, destined to restore balance to the world.",
    matchReason: "",
    confidence: 0
  },
  {
    title: "Attack on Titan",
    type: "Anime",
    year: 2013,
    rating: 9.0,
    episodes: 87,
    duration: "24 min",
    genres: ["Action", "Drama", "Dark", "Complex Plot"],
    description: "Humanity fights for survival against giant humanoid creatures called Titans in this dark and complex narrative.",
    matchReason: "",
    confidence: 0
  },
  {
    title: "Crash Landing on You",
    type: "K-Drama",
    year: 2019,
    rating: 8.7,
    episodes: 16,
    duration: "70 min",
    genres: ["Romance", "Comedy", "Adventure", "Strong Female Lead"],
    description: "A South Korean heiress accidentally paraglides into North Korea and meets a North Korean army officer.",
    matchReason: "",
    confidence: 0
  },
  {
    title: "Gravity Falls",
    type: "Cartoon",
    year: 2012,
    rating: 8.9,
    episodes: 40,
    duration: "22 min",
    genres: ["Mystery", "Comedy", "Supernatural", "Coming-of-age"],
    description: "Twin siblings discover supernatural mysteries in a small Oregon town during their summer vacation.",
    matchReason: "",
    confidence: 0
  },
  {
    title: "Death Note",
    type: "Anime",
    year: 2006,
    rating: 9.0,
    episodes: 37,
    duration: "23 min",
    genres: ["Thriller", "Supernatural", "Psychological", "Dark"],
    description: "A brilliant student finds a supernatural notebook that can kill anyone whose name is written in it.",
    matchReason: "",
    confidence: 0
  },
  {
    title: "Goblin",
    type: "K-Drama",
    year: 2016,
    rating: 8.6,
    episodes: 16,
    duration: "80 min",
    genres: ["Fantasy", "Romance", "Drama", "Supernatural"],
    description: "An immortal goblin seeks to end his eternal life and needs a human bride to remove the sword from his chest.",
    matchReason: "",
    confidence: 0
  }
];

async function callGeminiAPI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
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
      const apiKey = localStorage.getItem('gemini_api_key');
      if (!apiKey) {
        throw new Error('Please set your Gemini API key first');
      }

      // Create a detailed prompt for Gemini
      const prompt = `
You are an expert entertainment recommendation AI. A user is looking for series/shows to watch and has described what they want as: "${request.query}"

Here is a database of available series with their metadata:
${seriesDatabase.map(s => `
Title: ${s.title}
Type: ${s.type}
Year: ${s.year}
Rating: ${s.rating}
Episodes: ${s.episodes}
Genres: ${s.genres.join(', ')}
Description: ${s.description}
`).join('\n')}

Based on the user's query, analyze each series and:
1. Give it a relevance score from 0-100 based on how well it matches the query
2. Provide a specific reason why it matches (or doesn't match) the user's request
3. Consider themes, mood, character types, plot elements, and emotional tone

Return your analysis in this exact JSON format:
{
  "recommendations": [
    {
      "title": "Series Title",
      "confidence": 85,
      "matchReason": "Specific reason why this matches the user's request"
    }
  ]
}

Only include series with confidence scores above 60. Order by confidence score (highest first). Be specific about why each series matches the user's criteria.
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

      // Match analysis with our database and create final recommendations
      const recommendations = analysis.recommendations
        .map((rec: any) => {
          const series = seriesDatabase.find(s => s.title === rec.title);
          if (series) {
            return {
              ...series,
              matchReason: rec.matchReason,
              confidence: rec.confidence
            };
          }
          return null;
        })
        .filter(Boolean)
        .sort((a: any, b: any) => b.confidence - a.confidence)
        .slice(0, 6); // Return top 6 recommendations

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