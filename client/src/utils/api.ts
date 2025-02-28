/**
 * API utilities for making requests to the backend
 */

interface ApiResponse {
  data?: any;
  error?: string;
  status: number;
  headers: Headers;
}

interface ApiRequestOptions {
  headers?: Record<string, string>;
  isBinary?: boolean;
}

/**
 * Make an API request to the server
 *
 * @param method HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param endpoint API endpoint (e.g., "/api/products")
 * @param data Optional request body data for POST, PUT, PATCH
 * @param options Additional request options
 * @returns Promise with the API response
 */
export async function apiRequest(
  method: string,
  endpoint: string,
  data?: any,
  options: ApiRequestOptions = {},
): Promise<ApiResponse> {
  try {
    const headers = {
      ...(options.isBinary ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    };

    const config: RequestInit = {
      method,
      headers,
      credentials: "include", // Include cookies for authentication
    };

    if (data) {
      if (options.isBinary) {
        config.body = data;
      } else {
        config.body = JSON.stringify(data);
      }
    }

    const response = await fetch(endpoint, config);
    const responseHeaders = response.headers;
    const contentType = responseHeaders.get("Content-Type") || "";

    // Parse response based on content type
    let responseData;
    if (contentType.includes("application/json")) {
      responseData = await response.json();
    } else if (contentType.includes("text/")) {
      responseData = await response.text();
    } else {
      // Handle binary responses
      responseData = await response.blob();
    }

    if (!response.ok) {
      // Extract error message from response if available
      const errorMessage = responseData?.message || response.statusText;
      return {
        error: errorMessage,
        status: response.status,
        headers: responseHeaders,
      };
    }

    return {
      data: responseData,
      status: response.status,
      headers: responseHeaders,
    };
  } catch (error) {
    // Handle network errors or exceptions during fetch
    return {
      error: (error as Error).message || "Network error",
      status: 0, // 0 indicates network error or other fetch failure
      headers: new Headers(),
    };
  }
}

/**
 * Upload a file to the server
 *
 * @param endpoint API endpoint
 * @param file File to upload
 * @param additionalData Additional form data to include
 * @returns Promise with the API response
 */
export async function uploadFile(
  endpoint: string,
  file: File,
  additionalData?: Record<string, string>,
): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append("file", file);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  return apiRequest("POST", endpoint, formData, { isBinary: true });
}

/**
 * Download a file from the server
 *
 * @param endpoint API endpoint
 * @param filename Suggested filename for the download
 */
export async function downloadFile(
  endpoint: string,
  filename: string,
): Promise<void> {
  try {
    const response = await apiRequest("GET", endpoint);

    if (response.error) {
      throw new Error(response.error);
    }

    // Create a download link and click it
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Failed to download file", error);
    throw error;
  }
}
import { useState } from 'react';

// Using the existing apiRequest function that's already defined in this file

// Add the useApi hook that was missing
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const request = async <T>(method: string, url: string, data?: any): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest(method, url, data);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }
      
      const responseData = await response.json();
      return responseData as T;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    get: <T>(url: string) => request<T>('GET', url),
    post: <T>(url: string, data: any) => request<T>('POST', url, data),
    put: <T>(url: string, data: any) => request<T>('PUT', url, data),
    patch: <T>(url: string, data: any) => request<T>('PATCH', url, data),
    delete: <T>(url: string) => request<T>('DELETE', url),
    loading,
    error
  };
};
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add token logic here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global error responses
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      // e.g., redirect to login
    }
    return Promise.reject(error);
  }
);
