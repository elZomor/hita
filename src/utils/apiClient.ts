import axios from 'axios';
import { baseUrl } from '../constants.ts';
import {
  getAccessToken,
  getRefreshToken,
  removeTokens,
  setAccessToken,
} from './tokenUtils.ts';

const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${baseUrl}/token/refresh/`, {
            refresh: refreshToken,
          });
          setAccessToken(data.access);
          originalRequest.headers['Authorization'] =
            `Bearer ${data.accessToken}`;
          return apiClient(originalRequest);
        } catch {
          handleLogout();
        }
      } else {
        handleLogout();
      }
    }
    return Promise.reject(error);
  }
);

const handleLogout = () => {
  removeTokens();
  window.location.href = '/login'; // Or use useNavigate for programmatic navigation
};

export default apiClient;
