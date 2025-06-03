export class AuthManager {
  constructor(window, baseUrl = import.meta.env.VITE_BACKEND_AUTH_URL || './') {
    this.window = window;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  }

  detectAuthStatus() {
    const token = this.window.localStorage.getItem('accessToken');
    const queryParams = new URLSearchParams(this.window.location.search);

    if (queryParams.get('status') === 'loginsuccess' && queryParams.get('statuscode') === '200') {
      return 'authenticating';
    } else if (queryParams.get('status') === 'loginfail' && queryParams.get('statuscode') === '401') {
      return 'loginfailed';
    } else if (!token) {
      return 'login';
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        return 'login';
      }
      return 'authenticated';
    } catch {
      return 'login';
    }
  }

  clearAuthData() {
    this.window.localStorage.clear();
  }

  authenticateUser() {
    this.window.location.href = `${this.baseUrl}auth/login`;
  }

  async authorizeUser() {
    try {
      const response = await fetch(`${this.baseUrl}auth/token`, {
        method: 'POST',
        credentials: 'include', // セッションを認証で利用（を意味する以上の意図は無い）
      });

      if (response.ok) {
        const data = await response.json();
        this.window.localStorage.setItem('accessToken', data.accessToken);
        this.window.localStorage.setItem('email', data.email);
        return { success: true };
      } else if (response.status === 401) {
        return { success: false, error: 'unauthorized' };
      } else {
        throw new Error('Unexpected error');
      }
    } catch (error) {
      console.error('Authorization failed:', error);
      return { success: false, error: 'authfailed' };
    }
  }

  getUserEmail() {
    return this.window.localStorage.getItem('email') || '不明';
  }

  async verifyAuthorizedUser() {
    const token = this.window.localStorage.getItem('accessToken');
    if (!token) {
      return { success: false, error: 'unauthorized' };
    }

    try {
      const response = await fetch(`${this.baseUrl}auth/verify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return { 
          success: true,
          data: await response.json(),
        };
      } else if (response.status === 401) {
        return { success: false, error: 'unauthorized' };
      }
      throw new Error('Unexpected error');
    } catch (error) {
      console.error('Verification failed:', error);
      return { success: false, error: 'authfailed' };
    }
  }

}
