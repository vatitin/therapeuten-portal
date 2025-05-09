import axios from 'axios';
import AuthService from './AuthService';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

//todo if token expired, handle it
apiClient.interceptors.request.use(async (config) => {
  const token = await AuthService.getToken({
    audience: 'backend-client',
    scope: 'openid email profile roles',
    preferred_username: "service-account-backend-client",
    clientAddress: "172.18.0.1",
  });
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.error('No token available');
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
