export interface AuthUser {
  name: string;
  email: string;
  role: string;
}

export interface SignInResponse {
  message: string;
  user: AuthUser;
  token: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface SignUpResponse {
  message: string;
  user: AuthUser;
  token: string;
}
