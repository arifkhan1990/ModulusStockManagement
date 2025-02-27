
/**
 * API utility function for making requests to the server
 */
export async function apiRequest(
  method: string, 
  endpoint: string, 
  data?: any
): Promise<Response> {
  const url = endpoint.startsWith('http') ? endpoint : `${import.meta.env.VITE_API_URL || ''}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
  };
  
  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }
  
  try {
    return await fetch(url, options);
  } catch (error) {
    console.error('API request error:', error);
    throw new Error('Network error. Please check your connection and try again.');
  }
}
