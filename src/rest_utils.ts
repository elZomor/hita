import { baseUrl, devToken } from './constants.ts';

export const get_request = async (
  url: string,
  token: string | null
): Promise<Response> => {
  // const headers = {"Authorization": `Bearer ${token}`}
  console.log(token);
  const headers = { Authorization: `Bearer ${devToken}` };
  return await fetch(`${baseUrl}/${url}`, {
    method: 'GET',
    headers: headers,
  });
};

export const get_media_link = (mediaUrl: string): string => {
  return `${baseUrl}${mediaUrl}`;
};
