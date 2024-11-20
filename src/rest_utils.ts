import {baseUrl} from "./constants.ts";

export const get_request = async (url:string, token: string|null) :Promise<Response> => {
    const headers = {"Authorization": `Bearer ${token}`}
    // const headers = {"Authorization": `Bearer ${devToken}`}
    return await fetch(`${baseUrl}/${url}`, {
        method: "GET",
        headers: headers,
    });
}
