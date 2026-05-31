import { supabase } from './supabase';

/**
 * Utility for making API requests to the backend.
 * Handles base URL, authentication tokens, and default headers.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function apiFetch(endpoint: string, options: RequestInit & { responseType?: 'json' | 'blob' } = {}) {
  const { responseType = 'json', ...fetchOptions } = options;
  const url = `${BACKEND_URL}${endpoint}`;
  
  // Get the current session to include the JWT token
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  if (responseType === 'blob') {
    return response.blob();
  }

  return response.json();
}
