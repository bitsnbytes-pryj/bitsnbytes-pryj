// Admin API client for communicating with the admin backend

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
  expiresAt: string;
}

interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Helper to get token from localStorage
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

// Helper to set token in localStorage
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_token', token);
}

// Helper to remove token from localStorage
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_token');
}

// Helper to check if token is expired
export function isTokenExpired(): boolean {
  const expiresAt = localStorage.getItem('admin_token_expires');
  if (!expiresAt) return true;
  return new Date(expiresAt) < new Date();
}

// Generic fetch wrapper with auth
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  try {
    const response = await fetch(`${ADMIN_API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'An error occurred',
      };
    }
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await fetchApi<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data) {
      setToken(response.data.token);
      localStorage.setItem('admin_token_expires', response.data.expiresAt);
      localStorage.setItem('admin_user', JSON.stringify(response.data.user));
    }
    
    return response;
  },
  
  async logout(): Promise<void> {
    await fetchApi('/auth/logout', { method: 'POST' });
    removeToken();
    localStorage.removeItem('admin_token_expires');
    localStorage.removeItem('admin_user');
  },
  
  async getCurrentUser(): Promise<ApiResponse<LoginResponse['user']>> {
    return fetchApi<LoginResponse['user']>('/auth/me');
  },
};

// Events API
export const eventsApi = {
  list: (params: Record<string, string | number | boolean> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    return fetchApi<PaginatedResponse<any>>(`/events?${searchParams.toString()}`);
  },
  
  get: (id: string) => fetchApi<any>(`/events/${id}`),
  
  create: (data: any) => fetchApi<any>('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => fetchApi<any>(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchApi<void>(`/events/${id}`, {
    method: 'DELETE',
  }),
};

// Team API
export const teamApi = {
  list: (params: Record<string, string | number | boolean> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    return fetchApi<PaginatedResponse<any>>(`/team?${searchParams.toString()}`);
  },
  
  get: (id: string) => fetchApi<any>(`/team/${id}`),
  
  create: (data: any) => fetchApi<any>('/team', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => fetchApi<any>(`/team/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchApi<void>(`/team/${id}`, {
    method: 'DELETE',
  }),
};

// Projects API
export const projectsApi = {
  list: (params: Record<string, string | number | boolean> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    return fetchApi<PaginatedResponse<any>>(`/projects?${searchParams.toString()}`);
  },
  
  get: (id: string) => fetchApi<any>(`/projects/${id}`),
  
  create: (data: any) => fetchApi<any>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => fetchApi<any>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchApi<void>(`/projects/${id}`, {
    method: 'DELETE',
  }),
};

// Roles API
export const rolesApi = {
  list: (params: Record<string, string | number | boolean> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    return fetchApi<PaginatedResponse<any>>(`/roles?${searchParams.toString()}`);
  },
  
  get: (id: string) => fetchApi<any>(`/roles/${id}`),
  
  create: (data: any) => fetchApi<any>('/roles', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => fetchApi<any>(`/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchApi<void>(`/roles/${id}`, {
    method: 'DELETE',
  }),
};

// Submissions API
export const submissionsApi = {
  contacts: (params: Record<string, string | number | boolean> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    return fetchApi<PaginatedResponse<any>>(`/submissions/contacts?${searchParams.toString()}`);
  },
  
  joinApplications: (params: Record<string, string | number | boolean> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    return fetchApi<PaginatedResponse<any>>(`/submissions/join?${searchParams.toString()}`);
  },
  
  updateContactStatus: (id: string, status: string) => 
    fetchApi<any>(`/submissions/contacts/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  
  updateJoinStatus: (id: string, status: string) =>
    fetchApi<any>(`/submissions/join/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => fetchApi<any>('/dashboard/stats'),
  getRecentActivity: () => fetchApi<any>('/dashboard/activity'),
};