/**
 * API Client
 * Base HTTP client for API requests
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private authToken: string | null = null;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'https://api.stepflow.app';

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Ensure headers object exists
        config.headers = config.headers || {};

        // Add auth token if available
        if (this.authToken) {
          config.headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error as AxiosError));
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(this.handleError(error as AxiosError));
      },
    );
  }

  /**
   * Handle API errors
   */
  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
    };

    if (error.response) {
      // Server responded with error status
      apiError.status = error.response.status;
      apiError.message =
        (error.response.data as any)?.message || error.message || 'Server error occurred';
    } else if (error.request) {
      // Request made but no response
      apiError.message = 'Network error - please check your connection';
    } else {
      // Error in request setup
      apiError.message = error.message;
    }

    console.error('API Error:', apiError);
    return apiError;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
    // Update axios default Authorization header immediately
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  /**
   * Get authentication token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Generic GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, config);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Generic POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, config);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Generic PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, config);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Generic PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.patch(url, data, config);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url, config);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }
}

export const client = new ApiClient();
