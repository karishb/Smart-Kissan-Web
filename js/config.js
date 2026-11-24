/**
 * SmartKisan Web Platform - Configuration
 * Harmonized with Mobile App Backend Services
 */
const getApiBaseUrl = () => {
  // 1. Explicit runtime override
  if (window.SMARTKISAN_API_URL) return window.SMARTKISAN_API_URL;
  const storedUrl = localStorage.getItem('smartkisan_custom_api');
  if (storedUrl) return storedUrl;

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // 2. Local development running with website/server.js proxy
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return '/api';
  }

  // 3. Direct HTTP access to the production server (same as mobile app src/services/backendApi.js)
  if (protocol === 'http:') {
    return 'http://66.116.227.217:3001/api';
  }

  // 4. Default same-origin relative path (for Render/custom reverse proxy)
  return '/api';
};

const CONFIG = {
  API_BASE_URL: getApiBaseUrl(),
  PRODUCTION_API_URL: 'http://66.116.227.217:3001/api',
  AUTH_TOKEN_KEY: 'smartkisan_web_token',
  USER_DATA_KEY: 'smartkisan_web_user',
  APP_NAME: 'SmartKisan',
  APP_VERSION: '2.1.0',
  DEFAULT_MAP_CENTER: [30.9010, 75.8573], // Agrarian belt (Punjab / North India)
};

window.CONFIG = CONFIG;
