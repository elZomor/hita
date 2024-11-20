import {baseUrl, DEBUG, devToken} from './constants.ts';

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

export const get_media_link = (mediaUrl: string): string => {
    return `${baseUrl}${mediaUrl}`;
};