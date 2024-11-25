import { baseUrl, DEBUG, devToken } from './constants.ts';

export const get_request = async (
  url: string,
  token: string | null
): Promise<Response> => {
  const bearerToken: string = DEBUG ? devToken : token;
  const headers = { Authorization: `Bearer ${bearerToken}` };
  return await fetch(`${baseUrl}/${url}`, {
    method: 'GET',
    headers: headers,
  });
};

export const post_request = async (
  url: string,
  token: string | null,
  data: Record<string, any>
): Promise<Response> => {
  const bearerToken: string = DEBUG ? devToken : token;
  const headers = {
    Authorization: `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
  };
  return await fetch(`${baseUrl}/${url}`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  });
};

export const get_media_link = (mediaUrl: string): string => {
  return `${baseUrl}${mediaUrl}`;
};
