/**
 * SmartKisan Web Platform - Configuration
 */
const getApiBaseUrl = () => {
  // 1. Custom runtime override (via window or localStorage for testing)
  if (window.SMARTKISAN_API_URL) return window.SMARTKISAN_API_URL;
  const storedUrl = localStorage.getItem('smartkisan_custom_api');
  if (storedUrl) return storedUrl;

  const hostname = window.location.hostname;
  
  // 2. Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return window.location.port === '5000' ? '/api' : 'http://localhost:5000/api';
  }

  // 3. Render cloud production
  if (hostname.endsWith('onrender.com')) {
    // If hosted on Render as a static site, point to the deployed Render backend API
    return 'https://smartkisan-api.onrender.com/api';
  }

  // 4. Default same-origin relative path
  return '/api';
};

const CONFIG = {
  API_BASE_URL: getApiBaseUrl(),
  AUTH_TOKEN_KEY: 'smartkisan_web_token',
  USER_DATA_KEY: 'smartkisan_web_user',
  APP_NAME: 'SmartKisan',
  APP_VERSION: '1.2.1',
  DEFAULT_MAP_CENTER: [30.9010, 75.8573], // Agrarian belt (Punjab / North India)
};

window.CONFIG = CONFIG;
