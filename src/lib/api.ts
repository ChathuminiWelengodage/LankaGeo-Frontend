import { supabase } from './supabase';
import { MOCK_LIVE_GAUGES, LiveGaugeData } from './mock-flood-data';

/**
 * Utility for making API requests to the backend.
 * Handles base URL, authentication tokens, and default headers.
 */

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');

/**
 * Custom error class for API failures that includes the status code and response data.
 */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch(endpoint: string, options: RequestInit & { responseType?: 'json' | 'blob' } = {}) {
  const { responseType = 'json', ...fetchOptions } = options;
  
  // Normalize the endpoint to include /api/v1 if not already present
  let normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!normalizedEndpoint.startsWith('/api/')) {
    normalizedEndpoint = `/api/v1${normalizedEndpoint}`;
  }
  
  const url = `${BACKEND_URL}${normalizedEndpoint}`;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] Fetching: ${url}`);
  }
  
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
    if (process.env.NODE_ENV === 'development') {
      console.error(`[API] Error ${response.status} from ${url}:`, errorData);
    }
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
 * Fetches a previously stored analysis result by its request ID.
 * @param requestId The ID of the analysis request to fetch.
 */
export async function fetchAnalysisResult(requestId: string): Promise<unknown> {
  return apiFetch(`/api/v1/analyze/result/${requestId}`);
}

/**
 * Fetches live hydrological gauge telemetry data.
 */
export async function fetchLiveGauges(): Promise<Record<string, LiveGaugeData>> {
  return apiFetch('/api/v1/gauges/live');
}
