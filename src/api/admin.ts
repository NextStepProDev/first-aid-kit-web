import apiClient from './client';
import type { Page, BroadcastEmailRequest, MessageResponse } from '../types';

export interface UserResponse {
  userId: number;
  username: string;
  email: string;
  name: string;
  roles: string[];
  active: boolean;
  createdAt: string;
  lastLogin: string | null;
}

export const adminApi = {
  getUsers: async (page: number = 0, size: number = 20, sort: string = 'createdAt,desc'): Promise<Page<UserResponse>> => {
    const response = await apiClient.get<Page<UserResponse>>(`/admin/users?page=${page}&size=${size}&sort=${sort}`);
    return response.data;
  },

  deleteUser: async (userId: number, password: string): Promise<void> => {
    await apiClient.delete(`/admin/users/${userId}`, {
      data: { password },
    });
  },

  broadcastEmail: async (data: BroadcastEmailRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/admin/broadcast', data);
    return response.data;
  },

  sendSingleEmail: async (userId: number, data: BroadcastEmailRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>(`/admin/users/${userId}/email`, data);
    return response.data;
  },

  exportEmailsCsv: async (): Promise<Blob> => {
    const response = await apiClient.get('/admin/emails/csv', {
      responseType: 'blob',
    });
    return response.data;
  },
};