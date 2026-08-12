const API_BASE_URL = 'http://localhost:5000/api';

export const getAuthToken = () => localStorage.getItem('forgefit_token');
export const setAuthToken = (token: string) => localStorage.setItem('forgefit_token', token);
export const removeAuthToken = () => localStorage.removeItem('forgefit_token');

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }

  return response.json();
}
