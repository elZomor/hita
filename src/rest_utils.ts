import {useAuth} from "@clerk/clerk-react";
import {baseUrl, devToken} from "./constants.ts";

const getToken = async ():Promise<(string | null)> => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getToken } = useAuth();
    return await getToken();


}

export const get_request = async (url:string) :Promise<Response> => {
    const headers = {"Authorization": `Bearer ${await getToken()}`}
    // const headers = {"Authorization": `Bearer ${devToken}`}
    return await fetch(`${baseUrl}/${url}`, {
        method: "GET",
        headers: headers,
    });
}
