
import { API_CONFIG } from '@/config/api';
import { supabase } from '@/integrations/supabase/client';

/**
 * API client for making HTTP requests to backend services
 */
export class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;
  
  private constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }
  
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }
  
  /**
   * Make a GET request to the API
   */
  public async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const url = new URL(this.baseUrl + endpoint);
      
      // Add query parameters if provided
      if (params) {
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key].toString());
          }
        });
      }
      
      const headers = await this.getHeaders();
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }
      
      return await response.json();
    } catch (error) {
      this.logError('GET', endpoint, error);
      throw error;
    }
  }
  
  /**
   * Make a POST request to the API
   */
  public async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(this.baseUrl + endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }
      
      return await response.json();
    } catch (error) {
      this.logError('POST', endpoint, error);
      throw error;
    }
  }
  
  /**
   * Get authorization headers for API requests
   */
  private async getHeaders(): Promise<HeadersInit> {
    // Get current session for auth token
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Add authorization header if session exists
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    
    return headers;
  }
  
  /**
   * Handle error responses from the API
   */
  private async handleErrorResponse(response: Response): Promise<Error> {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'Unknown error occurred' };
    }
    
    const error = new Error(errorData.message || `Request failed with status ${response.status}`);
    (error as any).status = response.status;
    (error as any).data = errorData;
    return error;
  }
  
  /**
   * Log API errors
   */
  private logError(method: string, endpoint: string, error: any): void {
    console.error(`API ${method} ${endpoint} failed:`, error);
    // In production, you might want to send these errors to a logging service
  }
}

export const apiClient = ApiClient.getInstance();

