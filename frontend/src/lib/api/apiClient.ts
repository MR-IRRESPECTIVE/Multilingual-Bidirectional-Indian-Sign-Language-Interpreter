/**
 * Centralized API client for communicating with the FastAPI backend.
 * 
 * Uses NEXT_PUBLIC_API_BASE_URL environment variable (defaults to http://localhost:8000).
 * Provides typed request/response helpers with consistent error handling.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export class ApiError extends Error {
  code: string;
  statusCode: number;
  
  constructor(code: string, message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new ApiError(
      'NETWORK_ERROR',
      'Unable to connect to the translation service. Please check if the backend is running.',
      0
    );
  }
  
  const data = await response.json();
  
  if (!response.ok) {
    const errorData = data?.error || {};
    throw new ApiError(
      errorData.code || 'UNKNOWN_ERROR',
      errorData.message || 'An unexpected error occurred.',
      response.status
    );
  }
  
  return data as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new ApiError(
      'NETWORK_ERROR',
      'Unable to connect to the translation service. Please check if the backend is running.',
      0
    );
  }
  
  const data = await response.json();
  
  if (!response.ok) {
    const errorData = data?.error || {};
    throw new ApiError(
      errorData.code || 'UNKNOWN_ERROR',
      errorData.message || 'An unexpected error occurred.',
      response.status
    );
  }
  
  return data as T;
}
