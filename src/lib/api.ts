const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// En-tête ou jeton en mémoire facultatif (jamais stocké dans localStorage)
let inMemoryAccessToken: string | null = null;

export const setInMemoryToken = (token: string | null): void => {
  inMemoryAccessToken = token;
};

// Wrapper fetch sécurisé avec credentials: 'include' et renouvellement automatique sur 401
async function request<T>(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<T> {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  };

  if (inMemoryAccessToken) {
    headers['Authorization'] = `Bearer ${inMemoryAccessToken}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Envoi automatique des cookies httpOnly (nocibe_access_token, nocibe_refresh_token)
    });
  } catch (netErr: any) {
    const netError: any = new Error('Impossible de joindre le serveur NOCIBÉ. Vérifiez votre connexion ou réessayez plus tard.');
    netError.status = 0;
    netError.code = 'NETWORK_ERROR';
    netError.original = netErr;
    throw netError;
  }

  // Si 401 et qu'il ne s'agit pas d'un appel auth direct, tenter le renouvellement automatique (refresh token rotation)
  if (response.status === 401 && !isRetry && !endpoint.startsWith('/auth/login') && !endpoint.startsWith('/auth/refresh') && !endpoint.startsWith('/auth/register')) {
    try {
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        if (refreshData.token) {
          setInMemoryToken(refreshData.token);
        }
        // Réessayer la requête d'origine une seule fois avec les nouveaux identifiants
        return request<T>(endpoint, options, true);
      } else {
        setInMemoryToken(null);
      }
    } catch {
      setInMemoryToken(null);
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error: any = new Error(data.error || `Erreur serveur (${response.status})`);
    error.status = response.status;
    error.code = data.code;
    error.fieldErrors = data.fieldErrors;
    error.reqId = data.reqId;
    error.data = data;
    throw error;
  }

  return data as T;
}

export const api = {
  // --- AUTH ---
  auth: {
    login: async (email: string, password: string) => {
      const res = await request<{ message: string; token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.token) {
        setInMemoryToken(res.token);
      }
      return res;
    },

    register: async (data: {
      email: string;
      password: string;
      nom: string;
      prenom: string;
      telephone: string;
      entreprise?: string;
    }) => {
      const res = await request<{ message: string; token: string; user: any; emailSent?: boolean }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.token) {
        setInMemoryToken(res.token);
      }
      return res;
    },

    refresh: async () => {
      const res = await request<{ message: string; token: string; user: any }>('/auth/refresh', {
        method: 'POST',
      });
      if (res.token) {
        setInMemoryToken(res.token);
      }
      return res;
    },

    getMe: async () => {
      return request<{ user: any }>('/auth/me');
    },

    updateProfile: async (data: { nom?: string; prenom?: string; telephone?: string; entreprise?: string }) => {
      return request<{ message: string; user: any }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    updatePassword: async (currentPassword: string, newPassword: string) => {
      return request<{ message: string }>('/auth/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    },

    forgotPassword: async (email: string) => {
      return request<{ message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },

    resetPassword: async (token: string, newPassword: string) => {
      return request<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });
    },

    verifyEmail: async (token: string) => {
      return request<{ message: string }>('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    },

    resendVerification: async (email: string) => {
      return request<{ message: string }>('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },

    logout: async () => {
      setInMemoryToken(null);
      try {
        await request<{ message: string }>('/auth/logout', {
          method: 'POST',
        });
      } catch {
        // En cas de panne réseau, le cookie sera effacé côté client
      }
    },
  },

  // --- PRODUCTS ---
  products: {
    getAll: async () => {
      return request<{ products: any[] }>('/products');
    },
    getBySlug: async (slug: string) => {
      return request<{ product: any }>(`/products/${slug}`);
    },
  },

  // --- ORDERS ---
  orders: {
    getMyOrders: async () => {
      return request<{ orders: any[] }>('/orders/my');
    },
    getAllOrders: async () => {
      return request<{ orders: any[] }>('/orders/all');
    },
    getById: async (id: string) => {
      return request<{ order: any }>(`/orders/${id}`);
    },
    create: async (orderData: any) => {
      return request<{ message: string; order: any; orderId: string; numeroCommande: string; montantTotal: number }>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    },
    updateStatus: async (orderId: string, statut: string, description?: string) => {
      return request<{ message: string; order: any }>(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ statut, description }),
      });
    },
    sendMessage: async (orderId: string, message: string) => {
      return request<{ message: string; data: any }>(`/orders/${orderId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
    },
  },

  // --- QUOTES ---
  quotes: {
    submit: async (quoteData: any) => {
      return request<{ message: string; quoteId: string }>('/quotes', {
        method: 'POST',
        body: JSON.stringify(quoteData),
      });
    },
    getAll: async () => {
      return request<{ quotes: any[] }>('/quotes');
    },
  },

  // --- CONTACT ---
  contact: {
    submit: async (contactData: any) => {
      return request<{ message: string; id: string }>('/contact', {
        method: 'POST',
        body: JSON.stringify(contactData),
      });
    },
  },

  // --- CAREERS ---
  careers: {
    getOffers: async (params?: { search?: string; type?: string; secteur?: string; lieu?: string }) => {
      const q = new URLSearchParams();
      if (params?.search) q.append('search', params.search);
      if (params?.type && params.type !== 'Tous') q.append('type', params.type);
      if (params?.secteur && params.secteur !== 'Tous') q.append('secteur', params.secteur);
      if (params?.lieu && params.lieu !== 'Tous') q.append('lieu', params.lieu);
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<{ offers: any[] }>(`/careers/offers${queryStr}`);
    },
    getOfferBySlug: async (slug: string) => {
      return request<{ offer: any }>(`/careers/offers/${slug}`);
    },
    submitApplication: async (formData: FormData) => {
      return request<{ message: string; reference: string; applicationId: string }>('/careers/applications', {
        method: 'POST',
        body: formData,
      });
    },
    // Admin
    getAdminApplications: async (params?: { statut?: string; type?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.statut && params.statut !== 'Tous') q.append('statut', params.statut);
      if (params?.type && params.type !== 'Tous') q.append('type', params.type);
      if (params?.search) q.append('search', params.search);
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<{ applications: any[] }>(`/careers/admin/applications${queryStr}`);
    },
    getAdminApplication: async (id: string) => {
      return request<{ application: any }>(`/careers/admin/applications/${id}`);
    },
    updateApplicationStatus: async (id: string, statut: string, noteInterne?: string) => {
      return request<{ message: string; application: any }>(`/careers/admin/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ statut, noteInterne }),
      });
    },
  },

  // --- NEWS, COMMUNIQUES & EVENTS ---
  news: {
    getCommuniques: async () => {
      return request<{ communiques: any[] }>('/news/communiques');
    },
    getCommuniqueBySlug: async (slug: string) => {
      return request<{ communique: any }>(`/news/communiques/${slug}`);
    },
    getEvents: async () => {
      return request<{ events: any[] }>('/news/events');
    },
    getEventBySlug: async (slug: string) => {
      return request<{ event: any }>(`/news/events/${slug}`);
    },
  },

  // --- HEALTH ---
  health: async () => {
    return request<{ status: string; service: string; database: string }>('/health');
  },
};

export default api;
