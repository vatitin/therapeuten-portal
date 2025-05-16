import axios from 'axios';

const createApiClient = (token: string) => {
  const client = axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  client.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error('No token available');
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  return client;
};

export default createApiClient;
