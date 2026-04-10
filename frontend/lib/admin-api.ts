// Admin API client for communicating with the consolidated backend

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  total?: number;
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
      data: data.data,
      total: data.total,
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
    return fetchApi<any[]>(`/admin/events?${searchParams.toString()}`);
  },
  
  get: (id: string) => fetchApi<any>(`/admin/events/${id}`),
  
  create: (data: any) => fetchApi<any>('/admin/events', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => fetchApi<any>(`/admin/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchApi<void>(`/admin/events/${id}`, {
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
    return fetchApi<any[]>(`/admin/team?${searchParams.toString()}`);
  },
  
  get: (id: string) => fetchApi<any>(`/admin/team/${id}`),
  
  create: (data: any) => fetchApi<any>('/admin/team', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => fetchApi<any>(`/admin/team/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchApi<void>(`/admin/team/${id}`, {
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
    return fetchApi<any[]>(`/admin/projects?${searchParams.toString()}`);
  },
  
  get: (id: string) => fetchApi<any>(`/admin/projects/${id}`),
  
  create: (data: any) => fetchApi<any>('/admin/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => fetchApi<any>(`/admin/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchApi<void>(`/admin/projects/${id}`, {
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
    return fetchApi<any[]>(`/admin/roles?${searchParams.toString()}`);
  },
  
  get: (id: string) => fetchApi<any>(`/admin/roles/${id}`),
  
  create: (data: any) => fetchApi<any>('/admin/roles', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => fetchApi<any>(`/admin/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchApi<void>(`/admin/roles/${id}`, {
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
    return fetchApi<any[]>(`/admin/submissions/contacts?${searchParams.toString()}`);
  },
  
  joinApplications: (params: Record<string, string | number | boolean> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    return fetchApi<any[]>(`/admin/submissions/join?${searchParams.toString()}`);
  },
  
  eventRegistrations: (params: Record<string, string | number | boolean> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    return fetchApi<any[]>(`/admin/submissions/event-registrations?${searchParams.toString()}`);
  },
  
  roleApplications: (params: Record<string, string | number | boolean> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    return fetchApi<any[]>(`/admin/submissions/role-applications?${searchParams.toString()}`);
  },
  
  feedback: (params: Record<string, string | number | boolean> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    return fetchApi<any[]>(`/admin/submissions/feedback?${searchParams.toString()}`);
  },
  
  updateContact: (id: string, data: any) => 
    fetchApi<any>(`/admin/submissions/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  updateJoinApplication: (id: string, data: any) =>
    fetchApi<any>(`/admin/submissions/join/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  updateEventRegistration: (id: string, data: any) =>
    fetchApi<any>(`/admin/submissions/event-registrations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  updateRoleApplication: (id: string, data: any) =>
    fetchApi<any>(`/admin/submissions/role-applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  updateFeedback: (id: string, data: any) =>
    fetchApi<any>(`/admin/submissions/feedback/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => fetchApi<any>('/admin/dashboard/stats'),
  getActivity: (limit: number = 10) => fetchApi<any[]>(`/admin/dashboard/activity?limit=${limit}`),
};