interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.agentesdeconversao.com.br';
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.detail || 'Erro na requisição' };
      }

      return { data };
    } catch (error) {
      console.error('Erro na requisição:', error);
      return { error: 'Erro de conexão com a API' };
    }
  }

  async signup(email: string, password: string, metadata?: any) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, metadata }),
    });
  }

  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  async logout() {
    const response = await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
    return response;
  }

  async resetPassword(email: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async queryTable(table: string, select = '*', filters?: any, limit?: number, order?: any) {
    return this.request('/supabase/query', {
      method: 'POST',
      body: JSON.stringify({ table, select, filters, limit, order }),
    });
  }

  async insertData(table: string, data: any) {
    return this.request('/supabase/insert', {
      method: 'POST',
      body: JSON.stringify({ table, data }),
    });
  }

  async updateData(table: string, data: any, filters: any) {
    return this.request('/supabase/update', {
      method: 'POST',
      body: JSON.stringify({ table, data, filters }),
    });
  }

  async deleteData(table: string, filters: any) {
    return this.request('/supabase/delete', {
      method: 'POST',
      body: JSON.stringify({ table, filters }),
    });
  }

  async chatCompletion(
    messages: Array<{ role: string; content: string }>,
    options: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
      conversation_id?: string;
      provider?: string;
    } = {}
  ) {
    return this.request('/ai/chat/completion', {
      method: 'POST',
      body: JSON.stringify({
        messages,
        model: options.model || 'gpt-4',
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 800,
        conversation_id: options.conversation_id,
        provider: options.provider || 'openai',
      }),
    });
  }

  async getConversation(conversationId: string) {
    return this.request(`/ai/conversations/${conversationId}`);
  }

  async listConversations(limit = 10) {
    return this.request(`/ai/conversations?limit=${limit}`);
  }

  async sendWhatsAppMessage(
    phone: string,
    message: string,
    options: { media_url?: string; media_type?: string; caption?: string; delay_message?: number; delay_typing?: number } = {}
  ) {
    return this.request('/zapi/send', {
      method: 'POST',
      body: JSON.stringify({ phone, message, ...options }),
    });
  }

  async forwardWhatsAppMessage(phone: string, messageId: string, messagePhone: string, delayMessage?: number) {
    return this.request('/zapi/forward', {
      method: 'POST',
      body: JSON.stringify({ phone, message_id: messageId, message_phone: messagePhone, delay_message: delayMessage }),
    });
  }

  async getWhatsAppMessages(limit = 10, status?: string) {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (status) params.append('status', status);
    return this.request(`/zapi/messages?${params}`);
  }

  async setWhatsAppWebhookUrl(url: string) {
    return this.request('/zapi/webhook-url', {
      method: 'PUT',
      body: JSON.stringify({ url }),
    });
  }

  async checkZApiStatus() {
    return this.request('/zapi/status');
  }
}

export const apiClient = new ApiClient();
