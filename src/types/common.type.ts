export interface BaseResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  errCode?: string;
}

export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  limit: number;
  offset: number;
}
