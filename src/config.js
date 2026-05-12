/**
 * Configuration for API Base URL
 * Falls back to localhost:5000 in development
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://new-shree-shyam-misthan-bhandar-1.onrender.com';

// Helper to construct API URLs
export const getApiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
