// Utility functions for generating trailer and streaming links

export const generateTrailerUrl = (title: string, year?: number): string => {
  const searchQuery = year ? `${title} ${year} trailer` : `${title} trailer`;
  const encodedQuery = encodeURIComponent(searchQuery);
  return `https://www.youtube.com/results?search_query=${encodedQuery}`;
};

export const generateStreamingUrl = (title: string, year?: number): string => {
  const searchQuery = year ? `${title} ${year} watch online` : `${title} watch online`;
  const encodedQuery = encodeURIComponent(searchQuery);
  return `https://www.google.com/search?q=${encodedQuery}`;
};

export const openTrailer = (title: string, year?: number): void => {
  const url = generateTrailerUrl(title, year);
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const openStreaming = (title: string, year?: number): void => {
  const url = generateStreamingUrl(title, year);
  window.open(url, '_blank', 'noopener,noreferrer');
};