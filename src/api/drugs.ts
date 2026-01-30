import apiClient from './client';
import type {
  Drug,
  DrugRequest,
  DrugStatistics,
  FormOption,
  Page,
  DrugSearchParams,
} from '../types';

export const drugsApi = {
  getById: async (id: number): Promise<Drug> => {
    const response = await apiClient.get<Drug>(`/drugs/${id}`);
    return response.data;
  },

  create: async (data: DrugRequest): Promise<Drug> => {
    const response = await apiClient.post<Drug>('/drugs', data);
    return response.data;
  },

  update: async (id: number, data: DrugRequest): Promise<void> => {
    await apiClient.put(`/drugs/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/drugs/${id}`);
  },
// TODO
  // search: async (params: DrugSearchParams = {}): Promise<Page<Drug>> => {
  //   const searchParams = new URLSearchParams();

  //   if (params.name) searchParams.append('name', params.name);
  //   if (params.form) searchParams.append('form', params.form);
  //   if (params.expired !== undefined) searchParams.append('expired', String(params.expired));
  //   if (params.expirationUntilYear) searchParams.append('expirationUntilYear', String(params.expirationUntilYear));
  //   if (params.expirationUntilMonth) searchParams.append('expirationUntilMonth', String(params.expirationUntilMonth));
  //   if (params.page !== undefined) searchParams.append('page', String(params.page));
  //   if (params.size) searchParams.append('size', String(params.size));
  //   if (params.sort) searchParams.append('sort', params.sort);

  //   const response = await apiClient.get<Page<Drug>>(`/drugs/search?${searchParams.toString()}`);
  //   return response.data;
  // },
  search: async (params: any = {}): Promise<Page<Drug>> => {
  // Axios automatycznie zamieni ten obiekt na ?name=...&expired=... itd.
  const response = await apiClient.get<Page<Drug>>('/drugs/search', { params });
  return response.data;
},

  getForms: async (): Promise<FormOption[]> => {
    const response = await apiClient.get<Array<{ value: string; label: string }>>('/drugs/forms');
    return response.data.map(f => ({ value: f.value, label: f.label }));
  },

  getStatistics: async (): Promise<DrugStatistics> => {
    const response = await apiClient.get<DrugStatistics>('/drugs/statistics');
    return response.data;
  },

  exportPdf: async (params: DrugSearchParams = {}): Promise<Blob> => {
    const searchParams = new URLSearchParams();

    if (params.name) searchParams.append('name', params.name);
    if (params.form) searchParams.append('form', params.form);
    if (params.expired !== undefined) searchParams.append('expired', String(params.expired));
    if (params.page !== undefined) searchParams.append('page', String(params.page));
    if (params.size) searchParams.append('size', String(params.size));
    if (params.sort) searchParams.append('sort', params.sort);

    const response = await apiClient.get(`/drugs/export/pdf?${searchParams.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportCsv: async (params: DrugSearchParams = {}): Promise<Blob> => {
    const searchParams = new URLSearchParams();

    if (params.name) searchParams.append('name', params.name);
    if (params.form) searchParams.append('form', params.form);
    if (params.expired !== undefined) searchParams.append('expired', String(params.expired));
    if (params.page !== undefined) searchParams.append('page', String(params.page));
    if (params.size) searchParams.append('size', String(params.size));
    if (params.sort) searchParams.append('sort', params.sort);

    const response = await apiClient.get(`/drugs/export/csv?${searchParams.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
  sendAlerts: async (): Promise<number> => {
    const response = await apiClient.post<number>('/email/alert');
    return response.data;
  },

  deleteAll: async (password: string): Promise<{ deletedCount: number }> => {
    const response = await apiClient.post<{ deletedCount: number }>('/drugs/delete-all', {
      password,
    });
    return response.data;
  },
};
