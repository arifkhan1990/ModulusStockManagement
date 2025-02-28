
/**
 * API client to communicate with the server
 */

const BASE_URL = '';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
};

/**
 * Makes an API request to the server
 */
export async function apiRequest(
  endpoint: string,
  options: RequestOptions = {}
) {
  const { method = 'GET', body, headers = {} } = options;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const config: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'include',
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Handle 401 Unauthorized by redirecting to login
    if (response.status === 401) {
      window.location.href = '/auth/login';
      return null;
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * API functions for specific endpoints
 */

// Auth
export const authApi = {
  login: (credentials: { email: string; password: string }) => 
    apiRequest('/api/auth/login', { method: 'POST', body: credentials }),
  
  register: (userData: { name: string; email: string; password: string }) => 
    apiRequest('/api/auth/register', { method: 'POST', body: userData }),
  
  logout: () => apiRequest('/api/auth/logout', { method: 'POST' }),
  
  getCurrentUser: () => apiRequest('/api/auth/me'),
  
  forgotPassword: (email: string) => 
    apiRequest('/api/auth/forgot-password', { method: 'POST', body: { email } }),
  
  resetPassword: (token: string, newPassword: string) => 
    apiRequest('/api/auth/reset-password', { method: 'POST', body: { token, newPassword } }),
};

// Products
export const productsApi = {
  getAll: () => apiRequest('/api/products'),
  getById: (id: string) => apiRequest(`/api/products/${id}`),
  create: (product: any) => apiRequest('/api/products', { method: 'POST', body: product }),
  update: (id: string, product: any) => apiRequest(`/api/products/${id}`, { method: 'PUT', body: product }),
  delete: (id: string) => apiRequest(`/api/products/${id}`, { method: 'DELETE' }),
};

// Locations
export const locationsApi = {
  getAll: () => apiRequest('/api/locations'),
  getById: (id: string) => apiRequest(`/api/locations/${id}`),
  create: (location: any) => apiRequest('/api/locations', { method: 'POST', body: location }),
  update: (id: string, location: any) => apiRequest(`/api/locations/${id}`, { method: 'PUT', body: location }),
  delete: (id: string) => apiRequest(`/api/locations/${id}`, { method: 'DELETE' }),
};

// Suppliers
export const suppliersApi = {
  getAll: () => apiRequest('/api/suppliers'),
  getById: (id: string) => apiRequest(`/api/suppliers/${id}`),
  create: (supplier: any) => apiRequest('/api/suppliers', { method: 'POST', body: supplier }),
  update: (id: string, supplier: any) => apiRequest(`/api/suppliers/${id}`, { method: 'PUT', body: supplier }),
  delete: (id: string) => apiRequest(`/api/suppliers/${id}`, { method: 'DELETE' }),
};

// Inventory
export const inventoryApi = {
  getByLocation: (locationId: string) => apiRequest(`/api/inventory/${locationId}`),
  create: (inventory: any) => apiRequest('/api/inventory', { method: 'POST', body: inventory }),
};

// Stock Movements
export const stockMovementsApi = {
  getAll: () => apiRequest('/api/stock-movements'),
  getByProduct: (productId: string) => apiRequest(`/api/stock-movements?productId=${productId}`),
  create: (movement: any) => apiRequest('/api/stock-movements', { method: 'POST', body: movement }),
};
