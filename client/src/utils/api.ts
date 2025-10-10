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

export type ChatHistoryPart = { text: string };
export type ChatHistoryMessage = { role: 'user' | 'model'; parts: ChatHistoryPart[] };

export async function classifyQuery(query: string): Promise<{ type: 'general' | 'plan' }> {
  const res = await api.post('/api/ai/classify-query', { query });
  return res.data as { type: 'general' | 'plan' };
}

export async function planTasks(params: { query: string; code?: Record<string, string>; history?: ChatHistoryMessage[] }): Promise<{ tasks: { task: string }[] }>{
  const res = await api.post('/api/ai/plan-tasks', params);
  return res.data as { tasks: { task: string }[] };
}

export async function executeTask(params: { task: string; query?: string; code?: Record<string, string>; history?: ChatHistoryMessage[] }): Promise<{ explanation: string; files: Record<string, { code: string }>; raw?: string }>{
  const res = await api.post('/api/ai/execute-tasks', params);
  return res.data as { explanation: string; files: Record<string, { code: string }>; raw?: string };
}

