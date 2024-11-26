import { baseUrl } from '../constants.ts';
import apiClient from './apiClient.ts';
import axios, { AxiosResponse } from 'axios';
import { setAccessToken, setRefreshToken } from './tokenUtils.ts';

export const get_login_token = async (token: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const { data } = await axios.get(`${baseUrl}/auth/google/login/callback`, {
    headers: headers,
  });
  setAccessToken(data.data.ACCESS_TOKEN);
  setRefreshToken(data.data.REFRESH_TOKEN);
};

export const get_request = async (url: string): Promise<AxiosResponse> => {
  return await apiClient.get(url);
};

export const post_request = async (
  url: string,
  data: Record<string, any>
): Promise<AxiosResponse> => {
  return await apiClient.post(url, data);
};

export const get_media_link = (mediaUrl: string): string => {
  return `${baseUrl}${mediaUrl}`;
};
