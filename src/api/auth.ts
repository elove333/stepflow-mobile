/**
 * Authentication API
 */

import { client, ApiResponse } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

/**
 * Login user
 */
export const login = async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
  const response = await client.post<AuthResponse>('/auth/login', credentials);

  // Set auth token in client
  if (response.data.tokens.accessToken) {
    client.setAuthToken(response.data.tokens.accessToken);
  }

  return response;
};

/**
 * Register new user
 */
export const register = async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
  const response = await client.post<AuthResponse>('/auth/register', data);

  // Set auth token in client
  if (response.data.tokens.accessToken) {
    client.setAuthToken(response.data.tokens.accessToken);
  }

  return response;
};

/**
 * Logout user
 */
export const logout = async (): Promise<ApiResponse<void>> => {
  const response = await client.post<void>('/auth/logout');

  // Clear auth token
  client.setAuthToken(null);

  return response;
};

/**
 * Refresh authentication token
 */
export const refreshToken = async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
  const response = await client.post<AuthTokens>('/auth/refresh', {
    refreshToken,
  });

  // Update auth token
  if (response.data.accessToken) {
    client.setAuthToken(response.data.accessToken);
  }

  return response;
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  return await client.get<User>('/auth/me');
};

/**
 * Update user profile
 */
export const updateProfile = async (data: Partial<User>): Promise<ApiResponse<User>> => {
  return await client.patch<User>('/auth/profile', data);
};

/**
 * Change password
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<ApiResponse<void>> => {
  return await client.post<void>('/auth/change-password', {
    currentPassword,
    newPassword,
  });
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string): Promise<ApiResponse<void>> => {
  return await client.post<void>('/auth/reset-password/request', { email });
};

/**
 * Reset password with token
 */
export const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<ApiResponse<void>> => {
  return await client.post<void>('/auth/reset-password/confirm', {
    token,
    newPassword,
  });
};
