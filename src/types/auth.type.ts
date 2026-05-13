export interface User {
  id: number;
  username: string;
  email?: string;
  full_name?: string;
  phone?: string;
  role?: string;
  province?: string;
  is_admin: boolean;
  created_at: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  email?: string;
  full_name?: string;
  province?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
