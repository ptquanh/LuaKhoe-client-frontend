export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email?: string;
  phone: string;
  password: string;
  full_name: string;
  province: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    email: string;
    full_name: string;
  };
}
