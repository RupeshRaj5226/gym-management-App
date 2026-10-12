export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  id: number;
  fullName: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  user: LoginUser;
}
