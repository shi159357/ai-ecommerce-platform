"""
前端API对接层 — TypeScript 版
用于 Next.js 前端与 FastAPI 后端通信
"""
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

// Dashboard
export const getDashboardStats = (mode = 'all') =>
  fetchAPI<any>(`/dashboard/stats?mode=${mode}`);

export const getRevenueChart = () =>
  fetchAPI<any[]>('/dashboard/revenue-chart');

export const getPlatformBreakdown = () =>
  fetchAPI<any[]>('/dashboard/platform-breakdown');

// Products
export const getProducts = (params?: Record<string, string>) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchAPI<any>(`/products${qs}`);
};

// Orders
export const getOrders = (params?: Record<string, string>) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchAPI<any>(`/orders${qs}`);
};

// AI
export const triggerAISelect = () =>
  fetchAPI<any>('/ai/select');

export const getAIStatus = () =>
  fetchAPI<any>('/ai/status');

// System
export const getSystemHealth = () =>
  fetchAPI<any>('/system/health');

export const triggerHealthCheck = () =>
  fetchAPI('/system/heal', { method: 'POST' });

// Automation
export const getAutomationStatus = () =>
  fetchAPI<any>('/automation/status');

export const triggerTask = (taskId: string) =>
  fetchAPI(`/automation/trigger/${taskId}`, { method: 'POST' });
