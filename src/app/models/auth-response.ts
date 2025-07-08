export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      name: string;
    };
    token: string;
    token_type: string;
    expires_at: number;
  };
}

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
}
