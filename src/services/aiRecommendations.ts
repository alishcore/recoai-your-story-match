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

export class AIRecommendationService {
  static async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: request
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get recommendations');
      }

      return data;
    } catch (error) {
      console.error('Error calling AI recommendations:', error);
      throw error;
    }
  }
}