import { supabase } from './supabase';
import { MOCK_LIVE_GAUGES, LiveGaugeData } from './mock-flood-data';

/**
 * Utility for making API requests to the backend.
 * Handles base URL, authentication tokens, and default headers.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * Custom error class for API failures that includes the status code and response data.
 */
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

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
    throw new ApiError(
      errorData.message || `API request failed with status ${response.status}`,
      response.status,
      errorData
    );
  }

  if (responseType === 'blob') {
    return response.blob();
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
