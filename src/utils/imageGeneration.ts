// Utility for generating show-specific images

interface ShowImageOptions {
  title: string;
  type: string;
  genres: string[];
  description?: string;
}

export const generateShowImagePrompt = (show: ShowImageOptions): string => {
  const genreStyle = show.genres.slice(0, 2).join(' and ');
  
  let stylePrompt = '';
  if (show.type.toLowerCase().includes('anime')) {
    stylePrompt = 'anime art style, vibrant colors, detailed character design';
  } else if (show.type.toLowerCase().includes('k-drama')) {
    stylePrompt = 'cinematic Korean drama style, emotional lighting, beautiful cinematography';
  } else if (show.type.toLowerCase().includes('cartoon')) {
    stylePrompt = 'animated cartoon style, colorful and expressive';
  } else {
    stylePrompt = 'cinematic TV series style, dramatic lighting, high production value';
  }

  return `Movie poster for "${show.title}", ${genreStyle} ${show.type.toLowerCase()}, ${stylePrompt}, professional poster design, no text, high quality, 16:9 aspect ratio`;
};

export const generateShowImage = async (show: ShowImageOptions): Promise<string> => {
  try {
    const prompt = generateShowImagePrompt(show);
    console.log('Generating image for:', show.title, 'with prompt:', prompt);
    
    // We'll return a placeholder for now and implement actual generation
    // This would integrate with your preferred image generation service
    return `https://picsum.photos/800/450?random=${encodeURIComponent(show.title)}`;
  } catch (error) {
    console.error('Error generating image for', show.title, error);
    // Fallback to a themed placeholder
    return `https://picsum.photos/800/450?random=${Math.random()}`;
  }
};

// Cache for generated images to avoid regenerating
const imageCache = new Map<string, string>();

export const getCachedShowImage = async (show: ShowImageOptions): Promise<string> => {
  const cacheKey = `${show.title}-${show.type}`;
  
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }
  
  const imageUrl = await generateShowImage(show);
  imageCache.set(cacheKey, imageUrl);
  return imageUrl;
};