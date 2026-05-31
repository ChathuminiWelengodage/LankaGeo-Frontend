import { supabase } from './supabase';
import { MOCK_LIVE_GAUGES, LiveGaugeData } from './mock-flood-data';

/**
 * Utility for making API requests to the backend.
 * Handles base URL, authentication tokens, and default headers.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${BACKEND_URL}${endpoint}`;
  
  // Get the current session to include the JWT token
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Fetches live hydrological gauge telemetry data.
 * Currently uses mock data with a simulated delay for development.
 */
export async function fetchLiveGauges(): Promise<Record<string, LiveGaugeData>> {
  // In production, this would be:
  // return apiFetch('/api/v1/gauges/live');

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_LIVE_GAUGES);
    }, 1200);
  });
}
