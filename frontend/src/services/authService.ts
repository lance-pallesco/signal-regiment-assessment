import api from '../api/axios';
import type { LoginCredentials, User, ApiResponse } from '../types';

export const authService = {
  async getCsrfCookie(): Promise<void> {
    try {
      await api.get('/sanctum/csrf-cookie');
    } catch {
      // Ignore if session cookie already initialized
    }
  },

  async login(credentials: LoginCredentials): Promise<{ user: User }> {
    await this.getCsrfCookie();
    const response = await api.post<ApiResponse<never>>('/api/auth/login', credentials);
    return {
      user: response.data.user!,
    };
  },

  async logout(): Promise<void> {
    await api.post('/api/auth/logout');
  },

  async me(): Promise<User> {
    const response = await api.get<{ user: User }>('/api/auth/me');
    return response.data.user;
  },
};
