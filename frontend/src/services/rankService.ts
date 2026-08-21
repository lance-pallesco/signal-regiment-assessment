import api from '../api/axios';
import type { RankItem } from '../types';

export const rankService = {
  async list(): Promise<RankItem[]> {
    const response = await api.get<{ data: RankItem[] }>('/api/ranks');
    return response.data.data;
  },
};
