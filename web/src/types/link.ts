export interface Link {
  id: string;
  originalUrl: string;
  shortCode: string;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLinkRequest {
  originalUrl: string;
  shortCode: string;
}

export interface CreateLinkResponse {
  id: string;
  originalUrl: string;
  shortCode: string;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
}
