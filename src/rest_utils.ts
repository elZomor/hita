import { baseUrl } from './constants.ts';

export const get_request_with_token = async (
  url: string,
  token: string | null
): Promise<Response> => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return await fetch(`${baseUrl}/${url}`, {
    method: 'GET',
    headers: headers,
  });
};

export const get_request = async (url: string): Promise<Response> => {
  const token = localStorage.getItem('accessToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return await fetch(`${baseUrl}/${url}`, {
    method: 'GET',
    headers: headers,
  });
};

export const post_request = async (
  url: string,
  data: Record<string, any>
): Promise<Response> => {
  const token = localStorage.getItem('accessToken');
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  return await fetch(`${baseUrl}/${url}`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
    credentials: 'include',
  });
};

export const get_media_link = (mediaUrl: string): string => {
  return `${baseUrl}${mediaUrl}`;
};
