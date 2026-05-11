/**
 * Configuration for API Base URL
 * Falls back to localhost:5000 in development
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper to construct API URLs
export const getApiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
