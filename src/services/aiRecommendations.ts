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
      console.log('Calling AI recommendations with request:', request);
      
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: request
      });

      if (error) {
        console.error('Supabase function error:', error);
        // Check for specific error types
        if (error.message?.includes('Load failed')) {
          throw new Error('The AI service is currently unavailable. Please ensure the Edge Function is deployed.');
        }
        throw new Error(error.message || 'Failed to get recommendations');
      }

      console.log('AI recommendations response:', data);
      return data;
    } catch (error) {
      console.error('Error calling AI recommendations:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Load failed')) {
          throw new Error('The AI service is currently unavailable. Please check your Edge Function deployment.');
        }
        if (error.message.includes('Failed to send a request')) {
          throw new Error('Unable to connect to the AI service. Please check your Supabase configuration.');
        }
      }
      
      throw error;
    }
  }
}