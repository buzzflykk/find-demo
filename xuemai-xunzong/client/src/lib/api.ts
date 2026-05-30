const BASE = '';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (options?.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: '请求失败' }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  sendCode: (phone: string) =>
    request<{ message: string; code: string }>('/api/auth/send-code', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),
  login: (phone: string, code: string) =>
    request<{ token: string; userId: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    }),
  getProfile: () => request<{ id: string; nickname: string; avatar: string; membership: string }>('/api/auth/profile'),
  updateProfile: (data: { nickname?: string; avatar?: string }) =>
    request<{ message: string }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Upload
  upload: async (file: File): Promise<{ id: string; filePath: string }> => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE}/api/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: '上传失败' }));
      throw new Error(body.error || '上传失败');
    }
    return res.json();
  },

  // Missing Persons
  getMissingList: (page = 1) =>
    request<{ items: any[]; total: number; page: number }>(`/api/missing-persons?page=${page}`),
  getMissingDetail: (id: string) => request<any>(`/api/missing-persons/${id}`),
  createMissing: (data: any) =>
    request<{ id: string; message: string }>('/api/missing-persons', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateMissing: (id: string, data: any) =>
    request<{ message: string }>(`/api/missing-persons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  markFound: (id: string) =>
    request<{ message: string }>(`/api/missing-persons/${id}/found`, { method: 'POST' }),
  getMyMissing: () =>
    request<{ items: any[] }>('/api/missing-persons/my/list'),
  // Messages
  getConversations: () =>
    request<{ items: any[] }>('/api/messages/conversations'),
  getMessages: (missingPersonId: string, otherUserId: string) =>
    request<{ items: any[] }>(`/api/messages/${missingPersonId}/${otherUserId}`),
  sendMessage: (data: { receiver_id: string; missing_person_id: string; content?: string; msg_type?: string; image_url?: string }) =>
    request<{ id: string; message: string }>('/api/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getUnreadTotal: () =>
    request<{ total: number }>('/api/messages/unread/total'),

  // Match
  runMatch: (missingPersonId: string) =>
    request<{ matches: any[]; total: number }>(`/api/match/run/${missingPersonId}`, {
      method: 'POST',
    }),
  getMatchResults: (missingPersonId: string) =>
    request<{ matches: any[]; total: number }>(`/api/match/results/${missingPersonId}`),
  confirmMatch: (matchedPersonId: string, missingPersonId: string) =>
    request<{ message: string; matchedUserId: string; missingPersonId: string }>(
      `/api/match/confirm/${matchedPersonId}`,
      { method: 'POST', body: JSON.stringify({ missingPersonId }) },
    ),
  // Notifications
  getNotifications: () =>
    request<{ items: any[] }>('/api/notifications'),
  getUnreadNotificationCount: () =>
    request<{ count: number }>('/api/notifications/unread/count'),
  markNotificationRead: (id: string) =>
    request<{ message: string }>(`/api/notifications/read/${id}`, { method: 'POST' }),
  markAllNotificationsRead: () =>
    request<{ message: string }>('/api/notifications/read-all', { method: 'POST' }),

  // Subscriptions
  getSubscriptionPlans: () =>
    request<{ plans: any[] }>('/api/subscriptions/plans'),
  subscribe: (plan: string) =>
    request<{ message: string; subscriptionId: string; endDate: string }>('/api/subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    }),
  getMySubscription: () =>
    request<{ subscription: any; usage: any; membership: string }>('/api/subscriptions/my'),

  // Public (no auth)
  getPublicMissing: (id: string) => {
    const res = fetch(`/api/public/missing/${id}`);
    return res.then(r => r.ok ? r.json() : Promise.reject(new Error('未找到')));
  },

  searchMissing: (params: { q?: string; location?: string; lost_type?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.location) query.set('location', params.location);
    if (params.lost_type) query.set('lost_type', params.lost_type);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    return request<{ items: any[] }>(`/api/missing-persons/search?${query}`);
  },
};
