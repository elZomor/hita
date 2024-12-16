import { baseUrl } from '../constants.ts';
import apiClient from './apiClient.ts';
import axios, { AxiosResponse } from 'axios';
import { setAccessToken, setRefreshToken } from './tokenUtils.ts';
import { ProfileImage } from '../types/performer-form.ts';

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

export const delete_request = async (url: string): Promise<AxiosResponse> => {
  return await apiClient.delete(url);
};

export const post_request = async (
  url: string,
  data: Record<string, any>
): Promise<AxiosResponse> => {
  return await apiClient.post(url, data);
};

export const patch_request = async (
  url: string,
  data: Record<string, any>
): Promise<AxiosResponse> => {
  return await apiClient.patch(url, data);
};

export const patch_files = async (
  url: string,
  item: Record<string, any>
): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append('file', item.file);
  formData.append('description', item.description);
  formData.append('is_profile_picture', item.is_profile_picture);
  return await apiClient.patch(url, item, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const upload_file = async (
  url: string,
  item: Record<string, any>
): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append('file', item.file);
  formData.append('description', item.description);
  formData.append('is_profile_picture', item.is_profile_picture);
  return await apiClient.post(url, item, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const post_files = async (
  url: string,
  data: Record<string, any>
): Promise<AxiosResponse> => {
  const formData = new FormData();
  data.forEach((item: ProfileImage, index: number) => {
    formData.append(`files[${index}][file]`, item.file);
    formData.append(`files[${index}][description]`, item.description);
    formData.append(
      `files[${index}][is_profile_picture]`,
      item.isProfilePicture.toString()
    );
  });
  return await apiClient.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const get_media_link = (mediaUrl: string): string => {
  return mediaUrl.startsWith('/media') ? `${baseUrl}${mediaUrl}` : mediaUrl;
};

export const get_blob_video = async (url: string) => {
  return await apiClient.get(url, {
    responseType: 'blob',
  });
};
