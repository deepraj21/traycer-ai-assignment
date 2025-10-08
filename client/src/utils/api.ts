import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export type AuthUser = {
  id: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function signupRequest(email: string, password: string): Promise<AuthUser> {
  const res = await api.post('/api/auth/signup', { email, password });
  return res.data.user as AuthUser;
}

export async function signinRequest(email: string, password: string): Promise<AuthUser> {
  const res = await api.post('/api/auth/signin', { email, password });
  return res.data.user as AuthUser;
}

