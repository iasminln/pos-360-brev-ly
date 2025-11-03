import axios from 'axios';
import type { Link, CreateLinkRequest, CreateLinkResponse } from '../types/link';
import { env } from '../env';


const apiUrl = env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const linkService = {
  async createLink(data: CreateLinkRequest): Promise<CreateLinkResponse> {
    const response = await api.post<CreateLinkResponse>('/links', data);

    console.log("response", response.data);
    return response.data;
  },

  async getAllLinks(): Promise<Link[]> {
    const response = await api.get<Link[]>('/links');
    return response.data;
  },

  async getLinkByCode(shortCode: string): Promise<Link> {
    const response = await api.get<Link>(`/links/${shortCode}`);
    return response.data;
  },

  async deleteLink(id: string): Promise<void> {
    const response = await api.delete<void>(`/links/${id}`);
    return response.data;
  },

  getShortUrl(shortCode: string): string {
    return `${apiUrl}/${shortCode}`;
  },

  async exportLinksToCsv(): Promise<{ url: string, fileName: string }> {
    const response = await api.post<{ url: string, fileName: string }>('/links/export-csv');
    return response.data;
  },
};

export default api;
