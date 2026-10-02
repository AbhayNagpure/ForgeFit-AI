const API_BASE = '/api';

export function setAuthToken(token: string) {
  localStorage.setItem('forgefit_auth_token', token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem('forgefit_auth_token');
}

export function removeAuthToken() {
  localStorage.removeItem('forgefit_auth_token');
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : { error: await response.text() };

  if (!response.ok) {
    if (response.status === 401 && token) {
      removeAuthToken();
      window.dispatchEvent(new CustomEvent('forgefit:unauthorized'));
    }
    throw new ApiError(data.error || 'Something went wrong', response.status, data.code, data.details);
  }

  return data as T;
}
