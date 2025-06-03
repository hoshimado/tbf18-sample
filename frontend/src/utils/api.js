export class ApiManager {
  constructor(window, baseUrl = import.meta.env.VITE_BACKEND_API_URL || './') {
    this.window = window;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  }

  async greetingUser(message) {
    const token = this.window.localStorage.getItem('accessToken');
    if(!token) {
      return { success: false, error: 'unauthorized' };
    }

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    };

    if (message !== null && message !== undefined && message !== '') {
      fetchOptions.body = JSON.stringify({ message: message });
    }
    // messageが未設定の場合は空のbodyでPOSTする

    try {
      const response = await fetch(`${this.baseUrl}api/greeting`, fetchOptions);

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
