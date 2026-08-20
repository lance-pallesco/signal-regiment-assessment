import api from '../api/axios';
import type { LoginCredentials, User, ApiResponse } from '../types';

export const authService = {
  async getCsrfCookie(): Promise<void> {
    await api.get('/sanctum/csrf-cookie');
  },

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      await this.getCsrfCookie();
    } catch {
      // Proceed if CSRF cookie call is not required in token mode
    }

    const response = await api.post<ApiResponse<never>>('/api/auth/login', credentials);
    return {
      user: response.data.user!,
      token: response.data.token || '',
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
