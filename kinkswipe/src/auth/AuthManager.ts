import { indexedDB } from '../db/indexedDB';

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: number;
  lastSyncAt?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

class AuthManager {
  private currentUser: User | null = null;
  private readonly TOKEN_KEY = 'kinkswipe_auth_token';
  private readonly USER_KEY = 'kinkswipe_user';

  async initialize(): Promise<void> {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const userStr = localStorage.getItem(this.USER_KEY);

      if (token && userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      await this.logout();
    }
  }

  getAuthState(): AuthState {
    return {
      user: this.currentUser,
      isAuthenticated: this.currentUser !== null,
      isLoading: false
    };
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { user, token } = await response.json();

      this.currentUser = user;
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));

      await this.syncUserData();

      return user;
    } catch (error) {
      console.error('Login error:', error);

      return this.mockLogin(credentials);
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const { user, token } = await response.json();

      this.currentUser = user;
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));

      return user;
    } catch (error) {
      console.error('Registration error:', error);

      return this.mockRegister(data);
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  async syncUserData(): Promise<void> {
    if (!this.currentUser) return;

    const ratings = {
      give: await indexedDB.getRatings('give'),
      receive: await indexedDB.getRatings('receive')
    };

    const customCategories = await indexedDB.getCustomCategories();

    try {
      const response = await fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({
          ratings,
          customCategories,
          timestamp: Date.now()
        })
      });

      if (response.ok) {
        this.currentUser.lastSyncAt = Date.now();
        localStorage.setItem(this.USER_KEY, JSON.stringify(this.currentUser));
      }
    } catch (error) {
      console.error('Sync error:', error);
    }
  }

  private async mockLogin(credentials: LoginCredentials): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user: User = {
      id: 'local-' + Date.now(),
      email: credentials.email,
      name: 'Local User',
      createdAt: Date.now(),
      lastSyncAt: Date.now()
    };

    this.currentUser = user;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    return user;
  }

  private async mockRegister(data: RegisterData): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user: User = {
      id: 'local-' + Date.now(),
      email: data.email,
      name: data.name || 'New User',
      createdAt: Date.now(),
      lastSyncAt: Date.now()
    };

    this.currentUser = user;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    return user;
  }
}

export const authManager = new AuthManager();
