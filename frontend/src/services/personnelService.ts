import api from '../api/axios';
import type { Personnel, PersonnelFilters, PaginatedResponse, ApiResponse } from '../types';

export const personnelService = {
  async list(filters: PersonnelFilters = {}): Promise<PaginatedResponse<Personnel>> {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.rank) params.append('rank', filters.rank);
    if (filters.unit) params.append('unit', filters.unit);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    const response = await api.get<PaginatedResponse<Personnel>>(`/api/personnel?${params.toString()}`);
    return response.data;
  },

  async getNextSerialNumber(): Promise<string> {
    const response = await api.get<{ serial_number: string }>('/api/personnel/next-serial');
    return response.data.serial_number;
  },

  async get(id: number | string): Promise<Personnel> {
    const response = await api.get<ApiResponse<Personnel>>(`/api/personnel/${id}`);
    return response.data.data;
  },

  async create(formData: FormData): Promise<Personnel> {
    const response = await api.post<ApiResponse<Personnel>>('/api/personnel', formData);
    return response.data.data;
  },

  async update(id: number | string, formData: FormData): Promise<Personnel> {
    formData.append('_method', 'PUT');
    const response = await api.post<ApiResponse<Personnel>>(`/api/personnel/${id}`, formData);
    return response.data.data;
  },

  async delete(id: number | string): Promise<void> {
    await api.delete(`/api/personnel/${id}`);
  },
};
