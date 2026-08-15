const API_BASE = 'http://localhost:5000/api';

export function setAuthToken(token: string) {
  localStorage.setItem('forgefit_auth_token', token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem('forgefit_auth_token');
}

export function removeAuthToken() {
  localStorage.removeItem('forgefit_auth_token');
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}
