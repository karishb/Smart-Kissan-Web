/**
 * SmartKisan Web Platform - Auth & Session Manager
 */

const Auth = (() => {
  const isAuthenticated = () => {
    return Boolean(localStorage.getItem(CONFIG.AUTH_TOKEN_KEY));
  };

  const getUser = () => {
    try {
      const data = localStorage.getItem(CONFIG.USER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  };

  const getToken = () => {
    return localStorage.getItem(CONFIG.AUTH_TOKEN_KEY);
  };

  const setSession = (token, user) => {
    localStorage.setItem(CONFIG.AUTH_TOKEN_KEY, token);
    localStorage.setItem(CONFIG.USER_DATA_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { isAuthenticated: true, user } }));
  };

  const clearSession = () => {
    localStorage.removeItem(CONFIG.AUTH_TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_DATA_KEY);
    window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { isAuthenticated: false, user: null } }));
  };

  const login = async (identifier, password) => {
    const data = await API.auth.login(identifier, password);
    if (data.token && data.user) {
      setSession(data.token, data.user);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await API.auth.register(userData);
    if (data.token && data.user) {
      setSession(data.token, data.user);
    }
    return data;
  };

  const logout = () => {
    clearSession();
    window.location.hash = '#/login';
    if (window.showToast) {
      window.showToast('You have been logged out successfully.', 'info');
    }
  };

  return {
    isAuthenticated,
    getUser,
    getToken,
    setSession,
    clearSession,
    login,
    register,
    logout
  };
})();

window.Auth = Auth;
